import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import type { EventDraft } from '../../support/interfaces/event';

export class AdminEventsPage extends BasePage {
  private readonly eventsLink: Locator;
  private readonly addEventButton: Locator;
  private readonly titleInput: Locator;
  private readonly cityInput: Locator;
  private readonly venueInput: Locator;
  private readonly dateTimeInput: Locator;
  private readonly priceInput: Locator;
  private readonly totalSeatsInput: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.eventsLink = page.locator('a#nav-events');
    this.addEventButton = page.locator('a[href="/admin/events"] button:has-text("Add New Event")');
    this.titleInput = page.locator('input#event-title-input');
    this.cityInput = page.locator('input#city');
    this.venueInput = page.locator('input#venue');
    this.dateTimeInput = page.locator('input[id="event-date-&-time"]');
    this.priceInput = page.getByLabel('Price ($)');
    this.totalSeatsInput = page.getByLabel('Total Seats');
    this.submitButton = page.locator('#add-event-btn');
  }

  async createEvent(event: EventDraft): Promise<void> {
    await this.eventsLink.click();
    await this.addEventButton.click();

    await this.titleInput.fill(event.title);
    await this.cityInput.fill(event.city);
    await this.venueInput.fill(event.venue);
    await expect(this.dateTimeInput).toBeVisible();
    await this.dateTimeInput.fill(event.dateTimeInput);

    await this.priceInput.fill(String(event.price));
    await this.totalSeatsInput.fill(String(event.totalSeats));
    await this.submitButton.click();

    await expect(this.page.getByText('Event created!', { exact: true })).toBeVisible();
  }
}
