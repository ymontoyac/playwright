import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { BookingCustomer } from '../../support/config/environment';
import { extractBookingReference } from '../../support/utils/parsers';

export class BookingCheckoutPage {
  private readonly page: Page;
  private readonly ticketCount: Locator;
  private readonly incrementButton: Locator;
  private readonly fullNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly phoneInput: Locator;
  private readonly confirmBookingButton: Locator;
  private readonly bookingReferenceBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ticketCount = page.locator('#ticket-count');
    this.incrementButton = page.locator('button:has-text("+")');
    this.fullNameInput = page.getByLabel('Full Name');
    this.emailInput = page.locator('#customer-email');
    this.phoneInput = page.getByPlaceholder('+91 98765 43210');
    this.confirmBookingButton = page.locator('.confirm-booking-btn');
    this.bookingReferenceBadge = page.locator('.booking-ref').first();
  }

  async setTicketQuantity(quantity: number): Promise<void> {
    await expect(this.ticketCount).toHaveText('1');
    for (let count = 1; count < quantity; count += 1) {
      await this.incrementButton.click();
    }
  }

  async completeBooking(customer: BookingCustomer): Promise<void> {
    await this.fullNameInput.fill(customer.fullName);
    await this.emailInput.fill(customer.email);
    await this.phoneInput.fill(customer.phone);
    await this.confirmBookingButton.click();
  }

  async getConfirmationBookingRef(): Promise<string> {
    await expect(this.bookingReferenceBadge).toBeVisible();
    const rawValue = (await this.bookingReferenceBadge.innerText()).trim();
    return extractBookingReference(rawValue);
  }

  async goToMyBookings(): Promise<void> {
    await this.page.getByRole('link', { name: 'View My Bookings' }).click();
  }
}
