export const dateToStr = value => {
  return value ? new Date(value).toLocaleDateString() : value;
};

export const dateToLocaleStr = (value, locale) => {
  return value
    ? new Date(value).toLocaleDateString(locale, {
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    : value;
};

export const dateTimeToStr = value => {
  return value ? new Date(value).toLocaleString() : value;
};

export const unixDateTimeToStr = value => {
  return value ? new Date(value * 1000).toLocaleString() : value;
};

export const strToDate = value => {
  if (!value?.length) return '-';
  return [value?.slice(0, 4), '/', value?.slice(4, 6), '/', value?.slice(6)].join('');
};

export const byteToStr = value => {
  if (!Number(value)) return '-';
  const index = Math.floor(Math.log(Number(value)) / Math.log(1024));
  return (
    (Number(value) / Math.pow(1024, index)).toFixed(2) * 1 +
    ' ' +
    ['B', 'kB', 'MB', 'GiB', 'TB'][index]
  );
};

export const methodHttpToColor = value => {
  switch (value.toUpperCase()) {
    case 'GET':
      return '--blue-500';
    case 'POST':
      return '--green-500';
    case 'PUT':
    case 'PUTCH':
      return '--orange-500';
    case 'DELETE':
      return '--red-500';
    default:
      return '--gray-500';
  }
};

export const statusCodeToColor = value => {
  if (value < 200) {
    return 'text-blue-500';
  } else if (value >= 200 && value < 300) {
    return 'text-green-500';
  } else if (value >= 300 && value < 400) {
    return 'text-color-secondary';
  } else if (value >= 400 && value < 500) {
    return 'text-orange-500';
  } else {
    return 'text-red-500';
  }
};

export const capitalizeFirstLetter = str => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};
