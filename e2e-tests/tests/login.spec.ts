import { test, expect } from '@playwright/test';
import { describe } from 'node:test';
import { LoginPage } from '../pom/LoginPage';
import { LandingPage } from '../pom/LandingPage';
import { DashboardPage } from '../pom/DashboardPage';

describe('Login Page Tests', () => {
    let loginPage: LoginPage;
    let landingPage: LandingPage;
    let dashboardPage: DashboardPage

    test.beforeEach("initialize all pages", async ({ page }) => {
        loginPage = new LoginPage(page);
        landingPage = new LandingPage(page);
        dashboardPage = new DashboardPage(page);
    });

    test('Button Einloggen clicken', async ({ page }) => {
        await landingPage.goto();
        await landingPage.click(landingPage.loginButton);
        await loginPage.expectOnLoginPage(page);
    });

    test.describe('Login Functionality', () => {
        test.beforeEach("go to loginPage", async ({ page }) => {
            await loginPage.goto();
        });

        test('login with valid credentials', async ({ page }) => {
            await loginPage.login("e2e-tester@bht-berlin.de", "Hallo123!E2ETest");
            await page.waitForURL('**/dashboard', { waitUntil: 'networkidle' });
            await dashboardPage.expectOnDashboardPage(page);
        });

        test('login with invalid credentials', async ({ page }) => {
            await loginPage.login("test@bht-berlin.de", "12345679!!");
            await loginPage.expectOnLoginPage(page);
        });

        test('login with empty credentials', async ({ page }) => {
            await loginPage.login("", "");
            await loginPage.expectOnLoginPage(page);
        });
    });

});