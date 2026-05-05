import dotenv from 'dotenv';

dotenv.config();

export interface EventHubCredentials {
  email: string;
  password: string;
}

export interface BookingCustomer {
  fullName: string;
  email: string;
  phone: string;
}

const baseUrl = process.env.BASE_URL ?? 'https://eventhub.rahulshettyacademy.com';

export const environment = {
  baseUrl,
  credentials: {
    email: process.env.EVENT_HUB_EMAIL ?? '',
    password: process.env.EVENT_HUB_PASSWORD ?? '',
  } satisfies EventHubCredentials,
  bookingCustomer: {
    fullName: process.env.BOOKING_FULL_NAME ?? 'QA Automation User',
    email: process.env.EVENT_HUB_EMAIL ?? '',
    phone: process.env.BOOKING_PHONE ?? '+57 3001234567',
  } satisfies BookingCustomer,
};

export const ensureAuthConfig = (): void => {
  if (!environment.credentials.email || !environment.credentials.password) {
    throw new Error('Missing EVENT_HUB_EMAIL or EVENT_HUB_PASSWORD in .env file or pipeline variables.');
  }
};
