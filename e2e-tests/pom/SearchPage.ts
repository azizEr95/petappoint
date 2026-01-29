import { expect, type Locator, type Page } from '@playwright/test';
import { AbstractPage } from './AbstractPage';

export class SearchPage extends AbstractPage {
  readonly searchButton: Locator;
  readonly searchPlaceInput: Locator;

  constructor(page: Page) {
    super(page);
    this.searchButton = page.getByTestId('submit-search');
    this.searchPlaceInput = page.getByTestId('search-place-input');
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async practicesShown(): Promise<boolean> {
    const practices = this.page.locator('[data-testid^="practice-card-"]');
    const count = await practices.count();
    return count > 0;
  }

  async addPlaceInput(place: string) {
    await this.searchPlaceInput.fill(place);
  }

  async expectOnSearchPage(currentPage: Page) {
    await expect(currentPage).toHaveURL(/search/);
  }
}