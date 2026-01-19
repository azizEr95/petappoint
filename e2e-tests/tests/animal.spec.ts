import { test, expect } from '@playwright/test';
import { describe } from 'node:test';
import { LoginPage } from '../pom/LoginPage';
import { AnimalPage } from '../pom/AnimalPage';
import { DashboardPage } from '../pom/DashboardPage';

// these tests are skipped
describe.skip('Animal Page Tests', () => {
    let loginPage: LoginPage;
    let animalPage: AnimalPage;
    let dashboardPage: DashboardPage;

    test.beforeEach("initialize all pages and login", async ({ page }) => {
        loginPage = new LoginPage(page);
        animalPage = new AnimalPage(page);
        dashboardPage = new DashboardPage(page);

        await loginPage.goto();
        await loginPage.login("e2e-tester@bht-berlin.de", "Hallo123!E2ETest");
        await dashboardPage.expectOnDashboardPage(page);
        await animalPage.goto();
    });

    test.describe('create Animal', () => {
        test('create new dog correct', async ({ page }) => {
            await animalPage.setAnimalName('Max');
            await animalPage.click(animalPage.addAnimalButton);

            await animalPage.fillNewAnimalDialog('Hund', 'Max', '2020-01-15', 'männlich', true, 'outside', '0,78', '11,1');
            await animalPage.click(animalPage.createButton);
            await animalPage.expectOnAnimalPage(page);
            expect(await animalPage.expectAnimalInList()).toBe(true);
        });

        test('create new cat correct', async ({ page }) => {
            await animalPage.setAnimalName('mustertier');
            await animalPage.click(animalPage.addAnimalButton);

            await animalPage.fillNewAnimalDialog('Katze', 'mustertier', '2013-01-15', 'weiblich', true, 'inside');
            await animalPage.click(animalPage.createButton);
            await animalPage.expectOnAnimalPage(page);
            expect(await animalPage.expectAnimalInList()).toBe(true);
        });

        test('create new animal with invalid data', async ({ page }) => {
            await animalPage.setAnimalName('Maya');
            await animalPage.click(animalPage.addAnimalButton);

            await animalPage.fillNewAnimalDialog('', 'Maya', '2011-05-19', 'weiblich', true, 'inside');
            await animalPage.click(animalPage.createButton);
            await animalPage.closeAnimalDialog();
            await animalPage.expectOnAnimalPage(page);
            expect(await animalPage.expectAnimalInList()).toBe(false);
        });
    });

    test.describe('edit Animal correct', () => {
        // create animals to edit first
        test.beforeEach(async ({ page }) => {
            await animalPage.click(animalPage.addAnimalButton);
            await animalPage.fillNewAnimalDialog('Katze', 'Bambi', '2016-01-15', 'weiblich', true, 'inside');
            await animalPage.click(animalPage.createButton);
            await animalPage.expectOnAnimalPage(page);
        });

        test('edit Cat correct', async ({ page }) => {
            await animalPage.setAnimalName('Bambi');
            await animalPage.click(animalPage.editAnimalButton);

            await animalPage.fillEditAnimalDialog(undefined, "Bambiii", undefined, 'männlich', undefined, 'outside');
            await animalPage.click(animalPage.saveButton);
            await animalPage.expectOnAnimalPage(page);
            await animalPage.setAnimalName('Bambiii');
            expect(await animalPage.expectAnimalInList()).toBe(true);
        });
    });

    test.describe('edit Animal incorrect', () => {
        // create animals to edit first
        test.beforeEach(async ({ page }) => {
            await animalPage.click(animalPage.addAnimalButton);
            await animalPage.fillNewAnimalDialog('Katze', 'Nala', '2016-01-15', 'weiblich', true, 'inside');
            await animalPage.click(animalPage.createButton);
            await animalPage.expectOnAnimalPage(page);
        });

        test('edit Dog incorrect', async ({ page }) => {
            await animalPage.setAnimalName('Nala');
            await animalPage.click(animalPage.editAnimalButton);

            await animalPage.fillEditAnimalDialog(undefined, "s", undefined, undefined, undefined, undefined);
            await animalPage.click(animalPage.saveButton);
            await animalPage.closeAnimalDialog();
            await animalPage.expectOnAnimalPage(page);
            expect(await animalPage.expectAnimalInList()).toBe(true);
        });
    });

    test.describe('delete Animal correct', () => {
        // add animal to delete first
        test.beforeEach(async ({ page }) => {
            await animalPage.click(animalPage.addAnimalButton);
            await animalPage.fillNewAnimalDialog('Hund', 'WuffWuff', '2016-01-15', 'weiblich', true, 'inside');
            await animalPage.click(animalPage.createButton);
            await animalPage.expectOnAnimalPage(page);
        });

        test('delete succesfull', async ({ page }) => {
            await animalPage.setAnimalName('WuffWuff');
            await animalPage.click(animalPage.deleteAnimalButton);
            await animalPage.click(animalPage.deleteButton);
            await animalPage.expectOnAnimalPage(page);
            expect(await animalPage.expectAnimalInList()).toBe(false);
        });
    });

    test.describe('delete Animal cancel', () => {
        // add animal to delete first
        test.beforeEach(async ({ page }) => {
            await animalPage.click(animalPage.addAnimalButton);
            await animalPage.fillNewAnimalDialog('Hund', 'Wuff', '2016-01-15', 'weiblich', true, 'inside');
            await animalPage.click(animalPage.createButton);
            await animalPage.expectOnAnimalPage(page);
        });

        test('delete and cancel', async ({ page }) => {
            await animalPage.setAnimalName('Wuff');
            await animalPage.click(animalPage.deleteAnimalButton);
            await animalPage.click(animalPage.cancelButton);
            await animalPage.expectOnAnimalPage(page);
            expect(await animalPage.expectAnimalInList()).toBe(true);
        });
    });
});
