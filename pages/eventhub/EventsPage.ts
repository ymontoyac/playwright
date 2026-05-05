import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { extractFirstInteger } from '../../support/utils/parsers';

export class EventsPage extends BasePage {
  private readonly eventCards: Locator;

  constructor(page: Page) {
    super(page);
    this.eventCards = page.locator('[data-testid="event-card"]');
  }

  async open(): Promise<void> {
    await this.goto('/events');
    await expect(this.eventCards.first()).toBeVisible();
  }

  eventCardByTitle(title: string): Locator {
    return this.eventCards.filter({ hasText: title }).first();
  }

  async getSeatsFromCard(card: Locator): Promise<number> {
    const seatsText = await card.locator(':text-matches("seat", "i")').first().innerText();
    return extractFirstInteger(seatsText);
  }

  async openBookingFromCard(card: Locator): Promise<void> {
    await card.locator('[data-testid="book-now-btn"]').click();
  }

  async openBookingFromFirstCard(): Promise<void> {
    await this.openBookingFromCard(this.eventCards.first());
  }
}
