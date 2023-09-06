export const MONTHS_OF_YEAR = [
  { key: 1, label: 'January' },
  { key: 2, label: 'February' },
  { key: 3, label: 'March' },
  { key: 4, label: 'April' },
  { key: 5, label: 'May' },
  { key: 6, label: 'June' },
  { key: 7, label: 'July' },
  { key: 8, label: 'August' },
  { key: 9, label: 'September' },
  { key: 10, label: 'October' },
  { key: 11, label: 'November' },
  { key: 12, label: 'December' }
];

export const DAYS_OF_WEEK = [
  { key: 1, label: 'Monday' },
  { key: 2, label: 'Tuesday' },
  { key: 3, label: 'Wednesday' },
  { key: 4, label: 'Thursday' },
  { key: 5, label: 'Friday' },
  { key: 6, label: 'Saturday' },
  { key: 7, label: 'Sunday' }
];

export const monthOfNumber = value => {
  return MONTHS_OF_YEAR[value];
};

export const dayOfNumber = value => {
  return DAYS_OF_WEEK[value];
};
