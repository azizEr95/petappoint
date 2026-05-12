import { expect, type Locator, type Page } from '@playwright/test';
import { AbstractPage } from './AbstractPage';

export class PersonRegistrationPage extends AbstractPage {
    readonly submitButton: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly dateOfBirthInput: Locator;
    readonly sexSelect: Locator;
    readonly emailInput: Locator;
    readonly phoneInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly strasseInput: Locator;
    readonly hausnrInput: Locator;
    readonly plzInput: Locator;
    readonly stadtInput: Locator;
    readonly landInput: Locator;

    constructor(page: Page) {
        super(page);
        this.submitButton = page.getByTestId('person-submit-button');
        this.firstNameInput = page.getByTestId('person-firstName-input');
        this.lastNameInput = page.getByTestId('person-lastName-input');
        this.dateOfBirthInput = page.getByTestId('person-dateOfBirth-input');
        this.sexSelect = page.getByTestId('person-sex-select');
        this.emailInput = page.getByTestId('person-email-input');
        this.phoneInput = page.getByTestId('person-phone-input');
        this.passwordInput = page.getByTestId('person-password-input');
        this.confirmPasswordInput = page.getByTestId('person-confirmPassword-input');
        this.strasseInput = page.getByTestId('person-strasse-input');
        this.hausnrInput = page.getByTestId('person-hausnr-input');
        this.plzInput = page.getByTestId('person-plz-input');
        this.stadtInput = page.getByTestId('person-stadt-input');
        this.landInput = page.getByTestId('person-land-input');
    }

    async goto() {
        await this.page.goto('/registration/person');
    }

    async fillRegistrationForm(data: {
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        sex: 'male' | 'female' | 'not_applicable';
        email: string;
        phone: string;
        password: string;
        strasse: string;
        hausnr: string;
        plz: string;
        stadt: string;
    }) {
        await this.firstNameInput.fill(data.firstName);
        await this.lastNameInput.fill(data.lastName);
        await this.dateOfBirthInput.fill(data.dateOfBirth);
        await this.sexSelect.selectOption(data.sex);
        await this.emailInput.fill(data.email);
        await this.phoneInput.fill(data.phone);
        await this.passwordInput.fill(data.password);
        await this.confirmPasswordInput.fill(data.password);
        await this.strasseInput.fill(data.strasse);
        await this.hausnrInput.fill(data.hausnr);
        await this.plzInput.fill(data.plz);
        await this.stadtInput.fill(data.stadt);
        // country input is select and currently not filled
    }

    async expectOnRegistrationPage() {
        await expect(this.page).toHaveURL(/registration\/person/);
    }

    async expectOnPendingVerification() {
        await expect(this.page).toHaveURL(/registration\/verify-email/);
    }
}
