import { test, expect } from '@playwright/test';
import { describe } from 'node:test';
import { LoginPage } from '../pom/LoginPage';
import { LandingPage } from '../pom/LandingPage';
import { DashboardPage } from '../pom/DashboardPage';
import { SearchPage } from '../pom/SearchPage';

describe('book Appointment Tests', () => {
    let loginPage: LoginPage;
    let landingPage: LandingPage;
    let dashboardPage: DashboardPage
    let searchPage: SearchPage;

    test.beforeEach("initialize all pages and login", async ({ page }) => {
        loginPage = new LoginPage(page);
        landingPage = new LandingPage(page);
        dashboardPage = new DashboardPage(page);
        searchPage = new SearchPage(page);

        await loginPage.goto();
        await loginPage.login("e2e-tester@bht-berlin.de", "Hallo123!E2ETest");
        await searchPage.goto();
    });

    test('book Appointment successfull', async ({ page }) => {
        // book appointment test to be implemented
    });

    test('book Appointment cancel', async ({ page }) => {
        // book appointment test to be implemented
    });


});