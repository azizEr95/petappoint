import { expect, type Locator, type Page } from '@playwright/test';
import { AbstractPage } from './AbstractPage';

export class SearchPage extends AbstractPage {
  readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchButton = page.getByRole('button', { name: 'Suchen', exact: true });
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async practicesShown(): Promise<boolean> {
    const practices = this.page.locator('[data-testid^="practice-card-"]');
    if(practices.first()){
      return true;
    } else {
      return false;
    }
  }

  async expectOnSearchPage(currentPage: Page) {
    await expect(currentPage).toHaveURL(/search/);
  }
}