export const randomFutureDateTimeLocal = (maxDaysAhead = 60): string => {
  const randomDaysAhead = Math.floor(Math.random() * maxDaysAhead) + 1;
  const randomHour = Math.floor(Math.random() * 10) + 8;
  const randomMinuteOptions = [0, 15, 30, 45];
  const randomMinute = randomMinuteOptions[Math.floor(Math.random() * randomMinuteOptions.length)];

  const randomFutureDate = new Date();
  randomFutureDate.setDate(randomFutureDate.getDate() + randomDaysAhead);
  randomFutureDate.setHours(randomHour, randomMinute, 0, 0);

  return new Date(randomFutureDate.getTime() - randomFutureDate.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};
