export const dateToStr = (value) => {
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

export const dateTimeToStr = (value) => {
  return value ? new Date(value).toLocaleString() : value;
};

export const byteToStr = (value) => {
  if (!Number(value)) return '-';
  const index = Math.floor(Math.log(Number(value)) / Math.log(1024));
  return (Number(value) / Math.pow(1024, index)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GiB', 'TB'][index];
};

export const strToDate = (value) => {
  if (!value?.length) return '-';
  return [value?.slice(0, 4), '/', value?.slice(4, 6), '/', value?.slice(6)].join('');
};

export const eventToStr = (value) => {
  const [model, ...args] = value.split(':');
  if (value?.includes('find')) return `READ ${model.toUpperCase()} [ ${value} ]`;
  else if (value?.includes('create')) return `CREATE ${model.toUpperCase()} [ ${value} ]`;
  else if (value?.includes('update')) return `UPDATE ${model.toUpperCase()} [ ${value} ]`;
  else if (value?.includes('remove')) return `DELETE ${model.toUpperCase()} [ ${value} ]`;
  else return `GET ${model.toUpperCase()} [ ${value} ]`;
};

export const eventToColor = (value) => {
  const [model, ...args] = value.split(':');
  if (value?.includes('find')) return 'transparent';
  else if (value?.includes('create')) return 'var(--green-50)';
  else if (value?.includes('update')) return 'var(--yellow-50)';
  else if (value?.includes('remove')) return 'var(--red-50)';
  else return 'transparent';
};

export const capitalizeFirstLetter = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};
