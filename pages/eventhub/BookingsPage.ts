import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { environment } from '../../support/config/environment';

export class BookingsPage extends BasePage {
  private readonly bookingCards: Locator;
  private readonly viewDetailsLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.bookingCards = page.locator('#booking-card');
    this.viewDetailsLinks = page.getByRole('link', { name: 'View Details' });
  }

  async assertOnBookingsPage(): Promise<void> {
    await expect(this.page).toHaveURL(`${environment.baseUrl}/bookings`);
    await expect(this.bookingCards.first()).toBeVisible();
  }

  cardByBookingRef(bookingRef: string): Locator {
    return this.bookingCards
      .filter({ has: this.page.locator(`.booking-ref:text-is("${bookingRef}")`) })
      .first();
  }

  async openFirstBookingDetails(): Promise<void> {
    await expect(this.viewDetailsLinks.first()).toBeVisible();
    await this.viewDetailsLinks.first().click();
  }

  async openBookingDetailsByRef(bookingRef: string): Promise<void> {
    const bookingCard = this.cardByBookingRef(bookingRef);
    await expect(bookingCard).toBeVisible();
    await bookingCard.getByRole('link', { name: 'View Details' }).click();
  }
}
