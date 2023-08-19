import moment from 'moment';

export const monthDiff = (dateFrom: Date, dateTo: Date) => {
  return (
    dateTo.getMonth() -
    dateFrom.getMonth() +
    12 * (dateTo.getFullYear() - dateFrom.getFullYear())
  );
};

export const getMonthNames = (fromDate: Date, toDate: Date) => {
  const months = [];
  moment.locale('es-MX');
  const currentMonth = moment(fromDate);
  while (currentMonth.isSameOrBefore(toDate)) {
    months.push({
      name: toPascalCase(currentMonth.format('MMMM')),
      index: currentMonth.month(),
      year: currentMonth.year(),
    });
    currentMonth.add(1, 'months');
  }
  return months;
};

const toPascalCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const getMonthNameByDate = (date: Date) => {
  const month = date.toLocaleString('es-CO', { month: 'long' });
  return month.charAt(0).toUpperCase() + month.slice(1);
};
