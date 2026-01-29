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

  test('search VeterinaryPractice Berlin on Landing Page', async ({ page }) => {
    await landingPage.goto();
    await searchPage.addPlaceInput('Berlin');
    await landingPage.click(landingPage.searchButton);
    await searchPage.expectOnSearchPage(page);
  });


  test.describe('Search Functionality on Search Page', () => {

    test.beforeEach(async ({ page }) => {
      await page.goto('/search');
    });

    test('search page without selected place', async ({ page }) => {
      expect(await searchPage.practicesShown()).toBe(false);
      await expect(page).toHaveURL(/search/);
    });

    test('search VeterinaryPractice Hamburg on Search Page', async ({ page }) => {
      await searchPage.addPlaceInput('Hamburg');
      await searchPage.click(searchPage.searchButton);
      expect(await searchPage.practicesShown()).toBe(true);
      await expect(page).toHaveURL(/search/);
    });
  });

});