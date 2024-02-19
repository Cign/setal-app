export const getTodaysRangeDate = () => {
  const date = new Date();
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return { dateDebut: startOfDay.toISOString(), dateFin: endOfDay.toISOString() };
};

export const getWeeksRangeDate = () => {
  // Creates a new Date object for the start date
  const startDate = new Date();

  // Sets the hours, minutes, seconds, and milliseconds for the start date to the beginning of the day
  startDate.setHours(0, 0, 0, 0);

  // Sets the date of the start date to the beginning of the week (Sunday)
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // Creates a new Date object for the end date
  const endDate = new Date();

  // Sets the hours, minutes, seconds, and milliseconds for the end date to the end of the day
  endDate.setHours(23, 59, 59, 999);

  // Sets the date of the end date to the end of the week (Saturday)
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  return { dateDebut: startDate.toISOString(), dateFin: endDate.toISOString() };
};

export const getMonthRangeDate = () => {
// Creates a new Date object for the start date
const startDate = new Date();
// Sets the date of the start date to the first day of the month
startDate.setDate(1);
// Sets the hours, minutes, seconds, and milliseconds for the start date to the beginning of the day
startDate.setHours(0, 0, 0, 0);

// Creates a new Date object for the end date
const endDate = new Date();
// Sets the date of the end date to the first day of the next month
endDate.setMonth(endDate.getMonth() + 1, 1);
// Sets the date of the end date to one day before the first day of the next month
endDate.setDate(endDate.getDate() - 1);
// Sets the hours, minutes, seconds, and milliseconds for the end date to the end of the day
endDate.setHours(23, 59, 59, 999);
return { dateDebut: startDate.toISOString(), dateFin: endDate.toISOString() };
};
