import { expect, type Locator, type Page } from '@playwright/test';
import { AbstractPage } from './AbstractPage';

export class AnimalPage extends AbstractPage {
    readonly addAnimalButton: Locator;
    animalCardName: Locator | undefined;
    editAnimalButton: Locator | undefined;
    deleteAnimalButton: Locator | undefined;
    readonly saveButton: Locator;
    readonly createButton: Locator;
    readonly deleteButton: Locator;
    readonly cancelButton: Locator;

    readonly animalTypeSelect: Locator;
    readonly nameInput: Locator;
    readonly dateOfBirthInput: Locator;
    readonly sexSelect: Locator;
    readonly castratedSelect: Locator;
    readonly lifestyleSelect: Locator;
    readonly heightInput: Locator;
    readonly weightInput: Locator;
    readonly racesInput: Locator;

    constructor(page: Page) {
        super(page);
        this.addAnimalButton = page.getByTestId('add-animal');
        this.saveButton = page.getByTestId('animal-save-button');
        this.createButton = page.getByTestId('animal-create-button');
        this.deleteButton = page.getByTestId('animal-delete-button');
        this.cancelButton = page.getByTestId('animal-cancel-button');

        this.animalTypeSelect = page.getByTestId('animal-type-select'); // for animal dialog
        this.nameInput = page.getByTestId('animal-name-input');
        this.dateOfBirthInput = page.getByTestId('animal-dateOfBirth-input');
        this.sexSelect = page.getByTestId('animal-sex-select');
        this.castratedSelect = page.getByTestId('animal-castrated-select');
        this.lifestyleSelect = page.getByTestId('animal-lifestyle-select');
        this.heightInput = page.getByTestId('animal-height-input');
        this.weightInput = page.getByTestId('animal-weight-input');
        this.racesInput = page.getByTestId('animal-races-input');
    }

    async setAnimalName(name: string) {
        this.animalCardName = this.page.getByTestId('animal-card-' + name);
        this.editAnimalButton = this.page.getByTestId('edit-animal-' + name);
        this.deleteAnimalButton = this.page.getByTestId('delete-animal-' + name);
    }

    async goto() {
        await this.page.goto('/animals');
    }

    async closeAnimalDialog() {
        await this.cancelButton.click();
    }

    // not exact date of birth and Multiselect for races are not possible with this method
    async fillNewAnimalDialog(animaltype: string, name: string, dateOfBirth: string, sex: string, castrated: boolean, lifestyle: "inside" | "outside" | "mixed", height?: string, weight?: string) {
        await this.animalTypeSelect.selectOption(animaltype);
        await this.nameInput.fill(name);
        await this.dateOfBirthInput.fill(dateOfBirth);
        await this.sexSelect.selectOption(sex);
        if (castrated) {
            await this.castratedSelect.selectOption('kastriert');
        } else {
            await this.castratedSelect.selectOption('nicht-kastriert');
        }
        switch (lifestyle) {
            case "inside":
                await this.lifestyleSelect.selectOption('Indoor');
                break;
            case "outside":
                await this.lifestyleSelect.selectOption('Outdoor');
                break;
            case "mixed":
                await this.lifestyleSelect.selectOption('Mixed');
                break;
        }
        if (height && height?.length > 0) {
            await this.heightInput.fill(height);
        }
        if (weight && weight?.length > 0) {
            await this.weightInput.fill(weight);
        }
    }

    // not exact date of birth and Multiselect for races are not possible with this method
    // if undefined is passed, the field will not be changed
    async fillEditAnimalDialog(animaltype: string | undefined, name: string | undefined, dateOfBirth: string | undefined, sex: string | undefined, castrated: boolean | undefined, lifestyle: "inside" | "outside" | "mixed" | undefined, height?: string | undefined, weight?: string | undefined) {
        if (animaltype) {
            await this.animalTypeSelect.selectOption(animaltype);
        }
        if (name) {
            await this.nameInput.fill(name);
        }
        if (dateOfBirth) {
            await this.dateOfBirthInput.fill(dateOfBirth);
        }
        if (sex) {
            await this.sexSelect.selectOption(sex);
        }
        if (castrated === true) {
            await this.castratedSelect.selectOption('kastriert');
        } else if (castrated === false) {
            await this.castratedSelect.selectOption('nicht-kastriert');
        }
        switch (lifestyle) {
            case "inside":
                await this.lifestyleSelect.selectOption('Indoor');
                break;
            case "outside":
                await this.lifestyleSelect.selectOption('Outdoor');
                break;
            case "mixed":
                await this.lifestyleSelect.selectOption('Mixed');
                break;
        }
        if (height && height?.length > 0) {
            await this.heightInput.fill(height);
        }
        if (weight && weight?.length > 0) {
            await this.weightInput.fill(weight);
        }
    }

    async expectOnAnimalPage(currentPage: Page) {
        await expect(currentPage).toHaveURL(/animals/);
    }

    async expectAnimalInList() {
        if (!this.animalCardName) {
            throw new Error('animalCardName is undefined in expectAnimalInList');
        }
        await this.page.waitForTimeout(1000);
        if(await this.animalCardName!.isVisible()) {
            return true;
        } else {
            return false;
        }
    }
}
