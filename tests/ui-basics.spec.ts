import type { Page} from '@playwright/test';
import { expect, test } from '@playwright/test';
import { AdminEventsPage } from '../pages/eventhub/AdminEventsPage';
import { BookingCheckoutPage } from '../pages/eventhub/BookingCheckoutPage';
import { BookingDetailsPage } from '../pages/eventhub/BookingDetailsPage';
import { BookingsPage } from '../pages/eventhub/BookingsPage';
import { EventsPage } from '../pages/eventhub/EventsPage';
import { environment } from '../support/config/environment';
import { RefundExpectation } from '../support/enums/refund-expectation';
import { TicketQuantity } from '../support/enums/ticket-quantity';
import type { EventDraft } from '../support/interfaces/event';
import { randomFutureDateTimeLocal } from '../support/utils/date';
import { loginAndGoToBooking } from '../support/utils/login-and-go-to-booking';

const createEventDraft = (): EventDraft => ({
  title: `New Event ${Date.now()}`,
  city: 'Medellin',
  venue: 'Event Venue',
  dateTimeInput: randomFutureDateTimeLocal(),
  price: 100,
  totalSeats: 50,
});

const bookFirstEventAndOpenDetails = async (
  ticketQuantity: TicketQuantity,
  page: Page,
): Promise<BookingDetailsPage> => {
  const eventsPage = new EventsPage(page);
  const checkoutPage = new BookingCheckoutPage(page);
  const bookingsPage = new BookingsPage(page);
  const bookingDetailsPage = new BookingDetailsPage(page);

  await eventsPage.open();
  await eventsPage.openBookingFromFirstCard();
  await checkoutPage.setTicketQuantity(ticketQuantity);
  await checkoutPage.completeBooking(environment.bookingCustomer);
  const bookingRef = await checkoutPage.getConfirmationBookingRef();
  await checkoutPage.goToMyBookings();

  await bookingsPage.assertOnBookingsPage();
  await bookingsPage.openBookingDetailsByRef(bookingRef);
  await bookingDetailsPage.assertLoaded();

  return bookingDetailsPage;
};

test.describe('UI Basics - EventHub POC', () => {
  test.describe.configure({ mode: 'serial' });

  test('Assignment 1', async ({ page }) => {
    await loginAndGoToBooking(page);

    const eventDraft = createEventDraft();
    const adminEventsPage = new AdminEventsPage(page);
    const eventsPage = new EventsPage(page);
    const checkoutPage = new BookingCheckoutPage(page);
    const bookingsPage = new BookingsPage(page);

    await adminEventsPage.createEvent(eventDraft);

    await eventsPage.open();
    const targetEventCard = eventsPage.eventCardByTitle(eventDraft.title);
    await expect(targetEventCard).toBeVisible({ timeout: 5000 });

    const seatsBeforeBooking = await eventsPage.getSeatsFromCard(targetEventCard);
    await eventsPage.openBookingFromCard(targetEventCard);

    await checkoutPage.setTicketQuantity(TicketQuantity.Single);
    await checkoutPage.completeBooking(environment.bookingCustomer);

    const bookingRef = await checkoutPage.getConfirmationBookingRef();

    await checkoutPage.goToMyBookings();
    await bookingsPage.assertOnBookingsPage();

    const matchedBookingCard = bookingsPage.cardByBookingRef(bookingRef);
    await expect(matchedBookingCard).toBeVisible();
    await expect(matchedBookingCard).toContainText(eventDraft.title);

    await eventsPage.open();
    const updatedEventCard = eventsPage.eventCardByTitle(eventDraft.title);
    await expect(updatedEventCard).toBeVisible();

    const seatsAfterBooking = await eventsPage.getSeatsFromCard(updatedEventCard);
    expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
  });

  test('Assignment 2 - single ticket refund eligible', async ({ page }) => {
    await loginAndGoToBooking(page);

    const bookingDetailsPage = await bookFirstEventAndOpenDetails(TicketQuantity.Single, page);

    const bookingRef = await bookingDetailsPage.getBookingRef();
    const eventTitle = await bookingDetailsPage.getEventTitle();
    expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));

    await bookingDetailsPage.checkRefundEligibility();
    await bookingDetailsPage.assertRefundResult(
      RefundExpectation.Eligible,
      'Single-ticket bookings qualify for a full refund',
    );
  });

  test('Assignment 3 - group ticket refund not eligible', async ({ page }) => {
    await loginAndGoToBooking(page);

    const bookingDetailsPage = await bookFirstEventAndOpenDetails(TicketQuantity.Group, page);

    const bookingRef = await bookingDetailsPage.getBookingRef();
    const eventTitle = await bookingDetailsPage.getEventTitle();
    expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));

    await bookingDetailsPage.checkRefundEligibility();
    await bookingDetailsPage.assertRefundResult(
      RefundExpectation.NotEligible,
      'Group bookings (3 tickets) are non-refundable',
    );
  });
});
