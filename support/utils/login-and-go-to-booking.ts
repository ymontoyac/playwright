import type { Page } from '@playwright/test';
import { LoginPage } from '../../pages/eventhub/LoginPage';
import { ensureAuthConfig, environment } from '../config/environment';

export const loginAndGoToBooking = async (page: Page): Promise<void> => {
  ensureAuthConfig();
  const loginPage = new LoginPage(page);
  await loginPage.login(environment.credentials);
};
