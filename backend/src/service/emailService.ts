import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { SendSmtpEmail } from "@getbrevo/brevo";
import { emailServiceSetup } from "../singletonEmail";
import { EventType, PersonsType, VeterinariansType, VeterinaryPracticesType } from 'vetilib-shared/schemas/ZodSchemas';
import { personService } from './personService';
import { person_has_confirmation_code, VeterinaryPractice, veterinarypractices_has_confirmation_code } from '../../generated/prisma';
import { appointmentService } from './appointmentService';
import { dateFormatter } from '../utils/dateFormatter';
import { veterinaryPracticeService } from './veterinaryPracticeService';
import { prisma } from '../singletonPC';




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
    async sendConfirmationEmail(user: PersonsType): Promise<void> {

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

    async sendConfirmationEmailVetPractices(user: VeterinaryPracticesType): Promise<void> {

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

    async sendReminderEmail(): Promise<void> {
        const appointments = await appointmentService.checkReminderIncludesPerson();
        if (appointments.length === 0) {
            console.log("no appointments found");
            return;
        }
        const send = Promise.all(appointments.map(async (appointment) => {
            appointment.animal?.personHasAnimals.map(async (x) => {
                await this.sendAppointmentEmail(x.personId,appointment.id,"reminder");
            })
            if(appointment.startTime)
            await setEventFlag(appointment.id,"oneDayReminder")
        }));

        console.log("email send");
    },

    async sendAppointmentEmail(userid: number, appointmentId: number, type: "confirmation" | "termination" | "reminder") {
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
            case "reminder":
                emailtype = "appointmentReminder";
                appointmentData = {
                    firstName: user.firstName,
                    appointmentDate: dateFormatter(appointment.startTime, "date"),
                    appointmentTime: dateFormatter(appointment.startTime, "time"),
                    patientName: appointment.animal?.name ?? "",
                    serviceName: appointment.service?.name ?? "",
                    location: appointment.veterinaryPractice.address,
                    minutesBefore: "15min",
                    supportEmail: appointment.veterinaryPractice.email,
                    supportPhone: appointment.veterinaryPractice.phone,
                    clinicName: appointment.veterinaryPractice.name
                }
                message.subject = `Bereiten Sie sich auf Ihren Termin morgen um ${appointment.startTime.getUTCHours()} vor!`;
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
                return await veterinaryPracticeService.updateVerified(userId, code);
            } catch (error) {
                return false;
            }
        }
    },


}


async function setEventFlag(appointmentId: number, eventType: "oneDayReminder") {
    const eventData: EventType = {
        appointmentId: appointmentId,
        oneDayReminder: eventType === 'oneDayReminder' ? true : false
    };

    await prisma.email_events.upsert({
        where: {
            fk_appointmentid: appointmentId
        },
        update: {
            onedayreminder: eventData.oneDayReminder
        },
        create: {
            fk_appointmentid: appointmentId,
            onedayreminder: eventData.oneDayReminder
        }
    });

}

async function sendConfirmationEmail(userData: userDataMail, code?: string) {
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