import { expect, type Locator, type Page } from '@playwright/test';

export abstract class AbstractPage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async click(locator: Locator | undefined) {
    if(!locator) {
      throw new Error('Element in click from AbstractPage is undefined');
    }
    await expect(locator).toBeVisible();
    await locator.click();
  }
}
