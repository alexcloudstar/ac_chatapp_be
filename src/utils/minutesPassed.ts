export const fiveMinutesPassed = (date1, date2, minutes: number) => {
  const differenceInMilliseconds = Math.abs(date1 - date2);
  const differenceInMinutes = differenceInMilliseconds / (1000 * 60);

  return differenceInMinutes >= minutes;
};
