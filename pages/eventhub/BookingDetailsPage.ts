import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { RefundExpectation } from '../../support/enums/refund-expectation';
import { extractBookingReference } from '../../support/utils/parsers';

export class BookingDetailsPage {
  private readonly page: Page;
  private readonly bookingInformationHeading: Locator;
  private readonly bookingRefBadge: Locator;
  private readonly eventTitle: Locator;
  private readonly checkRefundButton: Locator;
  private readonly refundSpinner: Locator;
  private readonly refundResult: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bookingInformationHeading = page.getByText('Booking Information', { exact: true });
    this.bookingRefBadge = page.locator('main span.font-mono').first();
    this.eventTitle = page.locator('h1');
    this.checkRefundButton = page.locator('#check-refund-btn');
    this.refundSpinner = page.getByRole('status', { name: 'Loading' });
    this.refundResult = page.locator('#refund-result');
  }

  async assertLoaded(): Promise<void> {
    await expect(this.bookingInformationHeading).toBeVisible();
  }

  async getBookingRef(): Promise<string> {
    const rawText = (await this.bookingRefBadge.innerText()).trim();
    return extractBookingReference(rawText);
  }

  async getEventTitle(): Promise<string> {
    return (await this.eventTitle.innerText()).trim();
  }

  async checkRefundEligibility(): Promise<void> {
    await this.checkRefundButton.click();
    await expect(this.refundSpinner).toBeVisible();
    await expect(this.refundSpinner).not.toBeVisible({ timeout: 6000 });
    await expect(this.refundResult).toBeVisible();
  }

  async assertRefundResult(expectation: RefundExpectation, detailsText: string): Promise<void> {
    await expect(this.refundResult).toContainText(expectation);
    await expect(this.refundResult).toContainText(detailsText);
  }
}
