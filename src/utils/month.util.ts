export const monthDiff = (dateFrom: Date, dateTo: Date) => {
  return (
    dateTo.getMonth() -
    dateFrom.getMonth() +
    12 * (dateTo.getFullYear() - dateFrom.getFullYear())
  );
};

export const getMonthNames = (fromDate, toDate) => {
  const initMonth = fromDate.getMonth();
  const totalMonths = monthDiff(fromDate, toDate);
  return Array(totalMonths + 1)
    .fill('')
    .map((val, index) => {
      const monthIndex = (initMonth + index) % 12;
      const month = new Date(
        `2023-${(monthIndex + 1).toString().padStart(2, '0')}-02`,
      ).toLocaleString('es-CO', { month: 'long' });
      return {
        name: month.charAt(0).toUpperCase() + month.slice(1),
        index: monthIndex,
      };
    });
};
