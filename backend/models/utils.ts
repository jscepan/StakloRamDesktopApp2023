function formatDate(date, format) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  switch (format) {
    case 'DAY_MONTH_YEAR_DOT':
      return `${day}.${month}.${year}`;
    case 'DAY_MONTH_YEAR_CROSS':
      return `${day}/${month}/${year}`;
    case 'MONTH_DAY_YEAR_DOT':
      return `${month}.${day}.${year}`;
    case 'MONTH_DAY_YEAR_CROSS':
      return `${month}/${day}/${year}`;
    default:
      throw new Error('Invalid date format provided.');
  }
}

function formatNumber(value, decimalNumberSign, decimalPlaces = 2) {
  if (typeof value === 'number') {
    if (decimalNumberSign === ',') {
      return roundOnDigits(value, decimalPlaces).toLocaleString('de-DE', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      });
    } else {
      return roundOnDigits(value, decimalPlaces).toLocaleString('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      });
    }
  } else {
    return value;
  }
}

function roundOnDigits(value, numberOfDigits = 2) {
  return (
    Math.round(value * Math.pow(10, numberOfDigits)) /
    Math.pow(10, numberOfDigits)
  );
}

module.exports = { formatDate, formatNumber, roundOnDigits };
