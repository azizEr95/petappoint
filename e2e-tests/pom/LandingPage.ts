import { expect, type Locator, type Page } from '@playwright/test';
import { AbstractPage } from './AbstractPage';

export class LandingPage extends AbstractPage {
  readonly loginButton: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.loginButton = page.getByRole('link', { name: 'Einloggen', exact: true });
    this.searchButton = page.getByRole('button', { name: 'Suchen', exact: true });
  }

  async goto() {
    await this.page.goto('/');
  }

  async expectOnLandingPage(currentPage: Page) {
    await expect(currentPage).toHaveURL("/");
  }
}