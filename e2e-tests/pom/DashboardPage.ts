import { expect, type Locator, type Page } from '@playwright/test';
import { AbstractPage } from './AbstractPage';

export class DashboardPage extends AbstractPage {
  readonly logoutButton: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.logoutButton = page.getByRole('link', { name: 'Ausloggen', exact: true });
    this.searchButton = page.getByRole('link', { name: 'Suche', exact: true });
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async expectOnDashboardPage(currentPage: Page) {
    await expect(currentPage).toHaveURL(/dashboard/);
  }
}