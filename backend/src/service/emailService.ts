import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { SendSmtpEmail } from "@getbrevo/brevo";
import { emailServiceSetup } from "../singletonEmail";
import { PersonsType, VeterinariansType, VeterinaryPracticesType } from 'vetilib-shared/schemas/ZodSchemas';
import { personService } from './personService';
import { person_has_confirmation_code, VeterinaryPractice, veterinarypractices_has_confirmation_code } from '../../generated/prisma';
import { appointmentService } from './appointmentService';
import { dateFormatter } from '../utils/dateFormatter';
import { veterinaryPracticeService } from './veterinaryPracticeService';


const sender = {
    name: "vetilib",
    email: "aziz.erol@outlook.de"
}

type userDataMail = {
    name: string,
    email: string
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

        let generatedCode: string;
        // confirmation Code generator
        generatedCode = randomGenerator().toString().padStart(6, "0");

        const createdEntry = await personService.createConfirmationCode(user.id, generatedCode);
        const userData: userDataMail = {
            name: user.firstName,
            email: user.email
        }

        await sendConfirmationEmail(userData, createdEntry.code);
    },

    async sendConfirmationEmailVetPractices(user: VeterinaryPracticesType) {

        let generatedCode: string;


        // confirmation Code generator
        generatedCode = randomGenerator().toString().padStart(6, "0");

        const createdEntry = await veterinaryPracticeService.createConfirmationCode(user.id, generatedCode);

        const userData: userDataMail = {
            name: user.name,
            email: user.email
        }

        await sendConfirmationEmail(userData, createdEntry.code);
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
                appointmentData = {
                    firstName: user.firstName,
                    appointmentDate: dateFormatter(appointment.startTime, "date"),
                    appointmentTime: dateFormatter(appointment.startTime, "time"),
                    patientName: appointment.animal?.name ?? "",
                    serviceName: appointment.service?.name ?? "",
                    location: appointment.veterinaryPractice.address.street,
                    appointmentLink: `${process.env.PROD === "true" ? process.env.PROD_SERVER : process.env.DEV_SERVER}/appointments/`,
                    cancellationDeadline: dateFormatter(new Date(new Date().setDate(appointment.startTime.getDate() - 1)), "date"), //horrible fix but works
                    supportEmail: appointment.veterinaryPractice.email,
                    supportPhone: appointment.veterinaryPractice.phone,
                    clinicName: appointment.veterinaryPractice.name
                }
                message.subject = "Dein Termin wurde erfolgreich gebucht!";
                break;
            case "termination":
                emailtype = "appointmentTermination";
                appointmentData = {
                    firstName: user.firstName,
                    appointmentDate: dateFormatter(appointment.startTime, "date"),
                    appointmentTime: dateFormatter(appointment.startTime, "time"),
                    patientName: appointment.animal?.name ?? "",
                    serviceName: appointment.service?.name ?? "",
                    supportEmail: appointment.veterinaryPractice.email,
                    supportPhone: appointment.veterinaryPractice.phone,
                    clinicName: appointment.veterinaryPractice.name
                }
                message.subject = "Dein Termin wurde erfolgreich storniert!";

            default:
                break;
        }

        if (!emailtype) {
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

    async checkVerificationandSetVerifiedStatus(userId: number, code: string, role: "person" | "company" | undefined): Promise<person_has_confirmation_code | veterinarypractices_has_confirmation_code | false> {
        if (role === "person") {
            try {
                return await personService.updateVerified(userId, code);
            } catch (error) {
                return false;
            }
        } else {
            try {
                return await veterinaryPracticeService.updateVerified(userId,code);
            } catch (error) {
                return false;
            }
        }
    },


}

async function sendConfirmationEmail(userData: userDataMail, code: string) {
    //template 
    const templatePath = path.join(__dirname, `../../templates/email/confirmationEmail.html`);
    const templateSource = fs.readFileSync(templatePath, 'utf-8');

    // Handlebars compiles our Template
    const template = Handlebars.compile(templateSource);

    // random 6 digit code as one time password for every user 
    const data = {
        firstName: userData.name,
        confirmationCode: code,
        year: new Date().getFullYear()
    };

    // render template
    const htmlContent = template(data);

    const message = new SendSmtpEmail();
    message.subject = "Bitte bestätige deine Email-Adresse!";
    message.htmlContent = htmlContent;
    message.sender = sender;
    message.to = [{ email: userData.email }];

    try {
        const result = await emailAPI.sendTransacEmail(message);
        return result;
    } catch (error) {
        throw new Error("sending Confirmation Email didnt work");
    }
}