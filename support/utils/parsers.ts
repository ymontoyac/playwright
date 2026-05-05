export const extractFirstInteger = (value: string): number => {
  const match = value.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export const extractBookingReference = (value: string): string => {
  const match = value.match(/[A-Z]-[A-Z0-9]+/);
  if (!match) {
    throw new Error(`Unable to extract booking reference from value: ${value}`);
  }
  return match[0];
};
