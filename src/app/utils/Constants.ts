export const SHIFT_TYPES = [
  "WTQ",
  "PFTP",
  "General Onsite",
  "Wheel Service",
  "Wheel Building",
  "Wheel Recycling",
  "Bike Stripping",
  "Inner Tubes",
  "Shop Organizing",
  "Offsite Event",
  "Youth Volunteering"
];

export const MONTHS_SHORT = Array.from({ length: 12 }, (_, i) =>
  new Date(0, i).toLocaleString("en", { month: "short" })
);

const FROM_YEAR = 2020;
export const YEARS_RANGE = Array.from(
  { length: new Date().getFullYear() - FROM_YEAR + 1 },
  (_, i) => FROM_YEAR + i
);
