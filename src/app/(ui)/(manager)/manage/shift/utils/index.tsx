export const formatDate = (timestamp: string | null): string | null => {
  const dateTime = timestamp ? new Date(timestamp) : null;
  return dateTime
    ? dateTime.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    : null;
};

export const formatTime = (
  timestamp: string | null,
  options: { hour12: boolean } = { hour12: false }
): string | null => {
  const dateTime = timestamp ? new Date(timestamp) : null;
  return dateTime
    ? dateTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: options.hour12
      })
    : null;
};

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
