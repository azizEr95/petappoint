import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { SendSmtpEmail } from "@getbrevo/brevo";
import { emailServiceSetup } from "../singletonEmail";
import { PersonsType } from 'vetlib-shared/schemas/ZodSchemas';


// types 
const sender = {
    name: "vetlib",
    email: "info@vetlib.com"
}

// instance of Brevo email API
const emailAPI = emailServiceSetup();


export async function sendConfirmationEmail(user: PersonsType,jwtToken: string) {
    //template 
    const templatePath = path.join(__dirname, '../templates/confirmationEmail.html');
    const templateSource = fs.readFileSync(templatePath, 'utf-8');

    // Handlebars compiles our Template
    const template = Handlebars.compile(templateSource);

    // injecting Data confirmation link is route to endpoint with jwtToken 
    const data = {
        firstname: user.firstname,
        confirmationLink : '',
        confirmationCode: '22222',
        year: new Date().getFullYear()
    };

    // render template
    const htmlContent = template(data);

    const message = new SendSmtpEmail();
    message.subject = "Please Confirm Your Email Adress";
    message.htmlContent = htmlContent;
    message.to = [{email: user.email}]
    return await emailAPI.sendTransacEmail(message);
}