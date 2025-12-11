import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { SendSmtpEmail } from "@getbrevo/brevo";
import { emailServiceSetup } from "../singletonEmail";
import { AppointmentsType, PersonsType } from 'vetilib-shared/schemas/ZodSchemas';
import { personService } from './personService';
import { person_has_confirmation_code } from '../../generated/prisma';
import { appointmentService } from './appointmentService';


// types 
const sender = {
    name: "vetilib",
    email: "aziz.erol@outlook.de"
}

// instance of Brevo email API
const emailAPI = emailServiceSetup();

function randomGenerator(): number {
    return Math.floor(Math.random() * 999999);
}

export async function sendPasswordResetEmail(
    email: string,
    firstName: string,
    resetToken: string
): Promise<void> {
    const templatePath = path.join(__dirname, '../../templates/email/passwordResetEmail.html');
    const templateSource = fs.readFileSync(templatePath, 'utf-8');

    const template = Handlebars.compile(templateSource);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const resetLink = `${frontendUrl}/password-reset/confirm/${resetToken}`;

    const data = {
        firstName,
        resetLink,
        year: new Date().getFullYear()
    };

    const htmlContent = template(data);

    const message = new SendSmtpEmail();
    message.subject = "Passwort zurücksetzen - vetilib";
    message.htmlContent = htmlContent;
    message.sender = sender;
    message.to = [{ email }];

    try {
        const result = await emailAPI.sendTransacEmail(message);
        console.log('Password reset email sent:', result.body);
    } catch (error) {
        console.error('Failed to send password reset email:', error);
        throw new Error("Failed to send password reset email");
    }
}

export const emailService = {
    async sendConfirmationEmail(user: PersonsType) {

        //template 
        const templatePath = path.join(__dirname, `../../templates/email/confirmationEmail.html`);
        const templateSource = fs.readFileSync(templatePath, 'utf-8');

        // Handlebars compiles our Template
        const template = Handlebars.compile(templateSource);

        let generatedCode: string;


        // confirmation Code generator
        generatedCode = randomGenerator().toString().padStart(6, "0");

        const createdEntry = await personService.createConfirmationCode(user.id, generatedCode);


        // using jwttoken to verify through link/button click and a random 6 digit code as one time password for every user 
        const data = {
            firstName: user.firstName,
            confirmationCode: createdEntry.code,
            year: new Date().getFullYear()
        };
        // render template
        const htmlContent = template(data);

        const message = new SendSmtpEmail();
        message.subject = "Please Confirm Your Email Adress";
        message.htmlContent = htmlContent;
        message.sender = sender;
        message.to = [{ email: user.email }];

        try {
            const result = await emailAPI.sendTransacEmail(message);
            return result;
        } catch (error) {
            throw new Error("sending Confirmation Email didnt work");
        }
    },

    async sendAppointmentEmail(userid: number, appointmentId: number, type: string) {
        let emailtype: string = "";
        const user = await personService.getById(userid);
        const appointment = await appointmentService.getById(appointmentId);
        let appointmentData;
        const message = new SendSmtpEmail();
        switch (type) {
            case "confirmation":
                emailtype = "appointmentConfirmation";
                appointmentData  = {
                    firstName: user.firstName,
                    appointmentDate: appointment.startTime,
                    patientName: appointment.animal ? appointment.animal.name : "",
                    serviceName: appointment.service ? appointment.service.name : "",
                    location: appointment.veterinaryPractice.address,
                    supportEmail: appointment.veterinaryPractice.email,
                    supportPhone: appointment.veterinaryPractice.phone,
                    clinicName: appointment.veterinaryPractice.name
                }
                message.subject = "Your Appointment got confirmed!";
                break;
            case "termination": 
                emailtype = "appointmentTermination";
                appointmentData = {
                    firstName: user.firstName,
                    appointmentDate: appointment.startTime,
                    patientName: appointment.animal ? appointment.animal.name : "",
                    serviceName: appointment.service ? appointment.service.name : "",
                    supportEmail: appointment.veterinaryPractice.email,
                    supportPhone: appointment.veterinaryPractice.phone,
                    clinicName: appointment.veterinaryPractice.name
                }
                message.subject = "Your Appointment got canceled!";

            default:
                break;
        }

        if(!emailtype){
            throw new Error("mailtype not set!");
        }
        //template 
        const templatePath = path.join(__dirname, `../../templates/email/${emailtype}.html`);
        const templateSource = fs.readFileSync(templatePath, 'utf-8');

        // Handlebars compiles our Template
        const template = Handlebars.compile(templateSource);
        // render template
        const htmlContent = template(appointmentData);


        message.htmlContent = htmlContent;
        message.sender = sender;
        message.to = [{ email: user.email }];

        try {
            const result = await emailAPI.sendTransacEmail(message);
            return result;
        } catch (error) {
            throw new Error("sending Confirmation Email didnt work");
        }
    },

    /* function checks confirmationcode with db and sets VerifiedStatus to true when all conditions are met
    *
    * conditions: 15 min timer and code needs to be in db 
    */

    async checkVerificationandSetVerifiedStatus(userId: number, code: string): Promise<person_has_confirmation_code | false> {

        return await personService.updateVerified(userId,code);
    },
}
