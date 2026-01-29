import { expect, type Locator, type Page } from '@playwright/test';
import { AbstractPage } from './AbstractPage';

export class SearchPage extends AbstractPage {
  readonly searchButton: Locator;
  readonly searchPlaceInput: Locator;
  readonly animalTypeFilter: Locator;
  readonly appointmentTypeFilter: Locator;

  constructor(page: Page) {
    super(page);
    this.searchButton = page.getByTestId('submit-search');
    this.searchPlaceInput = page.getByTestId('search-place-input');
    this.animalTypeFilter = page.getByTestId('animal-type-filter'); // Assuming a test ID for animal type filter
    this.appointmentTypeFilter = page.getByTestId('appointment-type-filter'); // Assuming a test ID for treatment filter
  }

  async goto() {
    await this.page.goto('/search');
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