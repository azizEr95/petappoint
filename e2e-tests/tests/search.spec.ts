import { test, expect } from '@playwright/test';
import { describe } from 'node:test';
import { SearchPage } from '../pom/SearchPage';
import { LandingPage } from '../pom/LandingPage';

describe('Search Page Tests', () => {
  let searchPage: SearchPage;
  let landingPage: LandingPage;

  test.beforeEach("initialize all pages", async ({ page }) => {
    searchPage = new SearchPage(page);
    landingPage = new LandingPage(page);
  });

  test('Button Suchen clicken', async ({ page }) => {
    await landingPage.goto();
    await landingPage.click(landingPage.searchButton);
    await searchPage.expectOnSearchPage(page);
  });


  test.describe('Search Functionality', () => {

    test.beforeEach(async ({ page }) => {
      await page.goto('/search');
    });

    test('successful search', async ({ page }) => {
      expect(await searchPage.practicesShown()).toBe(true);
      await expect(page).toHaveURL(/search/);
    });

    // add tests, where text is entered in search field
    // TODO after search field is redesigned
  });

});