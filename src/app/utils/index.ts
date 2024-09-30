export const isSameDate = (date1: Date, date2: Date): boolean =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

export const formatDate = (timestamp: Date | null): string =>
  timestamp
    ? timestamp.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    : "Error";

export const formatTime = (
  timestamp: string | null,
  options: { hour12: boolean } = { hour12: false }
): string =>
  timestamp
    ? new Date(timestamp).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: options.hour12
      })
    : "Error";

export const isInMonth = (
  checkinTime: string | null,
  checkoutTime: string | null,
  month: string
): boolean => {
  const getMonthString = (date: Date | null) =>
    date ? date.toLocaleString("en-US", { month: "short" }) : null;
  return (
    getMonthString(checkinTime ? new Date(checkinTime) : null) === month ||
    getMonthString(checkoutTime ? new Date(checkoutTime) : null) === month
  );
};

export const isInYear = (
  timestamp1: string | null,
  timestamp2: string | null,
  year: number
): boolean => {
  const getYear = (date: Date | null) => (date ? date.getFullYear() : null);
  return (
    getYear(timestamp1 ? new Date(timestamp1) : null) === year ||
    getYear(timestamp2 ? new Date(timestamp2) : null) === year
  );
};

export const combineDateTime = (date: Date, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const resultDate: Date = new Date(date);
  resultDate.setHours(hours, minutes, 0, 0);
  return resultDate.toISOString();
};
