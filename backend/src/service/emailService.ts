import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { SendSmtpEmail } from "@getbrevo/brevo";
import { emailServiceSetup } from "../singletonEmail";
import { PersonsType } from 'vetlib-shared/schemas/ZodSchemas';


// types 
const sender = {
    name: "Aziz",
    email: "aziz.erol@outlook.de"
}

// instance of Brevo email API
const emailAPI = emailServiceSetup();


export async function sendConfirmationEmail(user: PersonsType,jwtToken: string | undefined) {
    if(!jwtToken) {
        throw new Error("jwtToken not set");
    }
    //template 
    const templatePath = path.join(__dirname, '../../templates/email/confirmationEmail.html');
    const templateSource = fs.readFileSync(templatePath, 'utf-8');

    // Handlebars compiles our Template
    const template = Handlebars.compile(templateSource);

    // injecting Data confirmation link is route to endpoint with jwtToken 
    // using jwttoken to verify through link/button click and a random 6 digit code as one time password for every user 
    const data = {
        firstname: user.firstName,
        confirmationLink : `localhost:3001/email-confirmation/${jwtToken}`,
        confirmationCode: '2222',
        year: new Date().getFullYear()
    };

    // render template
    const htmlContent = template(data);

    const message = new SendSmtpEmail();
    message.subject = "Please Confirm Your Email Adress";
    message.htmlContent = htmlContent;
    message.sender = sender;
    message.to = [{email: user.email}];

    try {
    const result = await emailAPI.sendTransacEmail(message);
    console.log(result.body);
    return result;
    } catch (error) {
        throw new Error("sending Confirmation Email didnt work");
    }
}