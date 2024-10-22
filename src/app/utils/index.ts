export const isSameDate = (date1: Date, date2: Date): boolean =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

export const formatDate = (
  timestamp: Date | null,
  options: { nullText: string } = { nullText: "Error" }
): string =>
  timestamp
    ? timestamp.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    : options.nullText;

export const formatTime = (timestamp: string | null): string =>
  timestamp
    ? new Date(timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      })
    : "Error";

export const convertTimeAMPM = (time: string): string => {
  if (time === "Error") {
    return time;
  }
  const [hours, minutes] = time.split(":");
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  }).format(new Date(0, 0, 0, parseInt(hours, 10), parseInt(minutes, 10)));
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

export const isUnder18 = (dob: string | null) => {
  if (dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const isBirthdayPassed =
      today >= new Date(birthDate.setFullYear(today.getFullYear()));
    return age < 18 || (age === 18 && !isBirthdayPassed);
  }
  return false;
};

export const isInactive = (lastSeen: string | null) => {
  if (lastSeen) {
    const today = new Date().getTime();
    const lastSeenDate = new Date(lastSeen).getTime();
    const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
    return today - lastSeenDate > oneYearInMs;
  }
  return true;
};

export const combineDateTime = (date: Date, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const resultDate: Date = new Date(date);
  resultDate.setHours(hours, minutes, 0, 0);
  return resultDate.toISOString();
};

export const arraysEqual = (arr1: string[], arr2: string[]) => {
  if (arr1.length !== arr2.length) return false;
  return arr1.sort().every((value, index) => value === arr2.sort()[index]);
};
