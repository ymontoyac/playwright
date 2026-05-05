import type { Page } from '@playwright/test';
import { environment } from '../../support/config/environment';

export abstract class BasePage {
  protected readonly page: Page;

  protected constructor(page: Page) {
    this.page = page;
  }

  protected async goto(path: string): Promise<void> {
    await this.page.goto(`${environment.baseUrl}${path}`);
  }
}
