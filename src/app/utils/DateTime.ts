export const isSameDate = (date1: Date, date2: Date): boolean =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

export const formatDate = (
  timestamp: Date | null,
  fallbackText: string = "N/A"
): string =>
  timestamp
    ? timestamp.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    : fallbackText;

export const formatTime = (timestamp: string | null): string | null =>
  timestamp &&
  new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

export const convertTimeAMPM = (time: string): string => {
  const [hours, minutes] = time.split(":");
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true
  }).format(new Date(0, 0, 0, parseInt(hours, 10), parseInt(minutes, 10)));
};

export const isInMonth = (time: string, month: string): boolean =>
  new Date(time).toLocaleString("en-US", { month: "short" }) === month;

export const isInYear = (time: string, year: number): boolean =>
  new Date(time).getFullYear() === year;

export const isUnder24 = (dob: string | null): boolean => {
  if (dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const isBirthdayPassed =
      today >= new Date(birthDate.setFullYear(today.getFullYear()));
    return age < 24 || (age === 24 && !isBirthdayPassed);
  }
  return false;
};

export const isInactive = (lastSeen: string): boolean =>
  new Date().getTime() - new Date(lastSeen).getTime() >
  365 * 24 * 60 * 60 * 1000;

export const combineDateTime = (date: Date, time: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  const resultDate: Date = new Date(date);
  resultDate.setHours(hours, minutes, 0, 0);
  return resultDate.toISOString();
};
