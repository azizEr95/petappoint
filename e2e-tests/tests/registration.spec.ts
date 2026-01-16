import { test, expect } from '@playwright/test';
import { PersonRegistrationPage } from '../pom/PersonRegistrationPage'; // name PersonRegistrationPage is correct here

// only testing the person registration, without complete verification flow (confirmation code is not accessible here)
test.describe('Person Registration', () => {
    let registrationPage: PersonRegistrationPage;

    test.beforeEach(async ({ page }) => {
        registrationPage = new PersonRegistrationPage(page);
        await registrationPage.goto();
    });

    // this test doesnt work in ci pipeline, because email sending in pipeline is not possible
    // fix: change code in backend to only send email if it is not in ci pipeline???
    // test('should successfully register a new person', async () => {
    //     await registrationPage.fillRegistrationForm({
    //         firstName: 'Max',
    //         lastName: 'Mustermann',
    //         dateOfBirth: '1990-01-01',
    //         sex: 'male',
    //         email: 'max.mustermann@example.com',
    //         phone: '+491234567890',
    //         password: 'TestPass123!',
    //         strasse: 'Musterstraße',
    //         hausnr: '123',
    //         plz: '12345',
    //         stadt: 'Berlin',
    //         land: 'Deutschland'
    //     });

    //     await registrationPage.click(registrationPage.submitButton);
    //     await registrationPage.expectOnPendingVerification();
    // });

    test('fill registration person not complete', async () => {
        await registrationPage.fillRegistrationForm({
            firstName: 'Max',
            lastName: 'Mustermann',
            dateOfBirth: '1990-01-01',
            sex: 'male',
            email: 'max.mustermann',
            phone: '+491234567890',
            password: 'TestPass12',
            strasse: 'Musterstraße',
            hausnr: '123',
            plz: '12345',
            stadt: 'Berlin',
        });

        await registrationPage.click(registrationPage.submitButton);
        await registrationPage.expectOnRegistrationPage();
    });
});
