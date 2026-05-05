import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import type { EventHubCredentials } from '../../support/config/environment';

export class LoginPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  private readonly browseEventsLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input#email');
    this.passwordInput = page.locator('input#password');
    this.signInButton = page.locator('button#login-btn');
    this.browseEventsLink = page.getByRole('link', { name: 'Browse Events', exact: true });
  }

  async login(credentials: EventHubCredentials): Promise<void> {
    await this.goto('/login');
    await this.emailInput.fill(credentials.email);
    await this.passwordInput.fill(credentials.password);
    await this.signInButton.click();
    await expect(this.browseEventsLink).toBeVisible();
  }
}
