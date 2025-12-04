// function to instanciate Email API Service 
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";

let emailAPI: TransactionalEmailsApi | undefined = undefined;

export function emailServiceSetup(): TransactionalEmailsApi {
    if(!process.env.BREVO_API_KEY) {
        throw new Error("Email API Key not set")
    }
    if(!emailAPI) {
        emailAPI = new TransactionalEmailsApi();
        emailAPI.setApiKey(TransactionalEmailsApiApiKeys.apiKey,process.env.BREVO_API_KEY);
        return emailAPI;
    }
    return emailAPI;
}