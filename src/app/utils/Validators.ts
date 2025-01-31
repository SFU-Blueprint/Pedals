export const setsEqual = (set1: Set<string>, set2: Set<string>) => {
  if (set1.size !== set2.size) return false;
  return Array.from(set1).every((value) => set2.has(value));
};

export const validUsername = (username: string) =>
  /^[a-z0-9]{5,15}$/.test(username);

export const validFullName = (name: string): boolean => {
  const trimmedName = name.trim();

  // Ensure name hasn't changed after trimming (no leading/trailing spaces)
  if (trimmedName !== name) return false;

  // Ensure no consecutive spaces
  if (/\s{2,}/.test(trimmedName)) return false;

  // Ensure only valid characters
  if (!/^[A-Za-z'.-\s]+$/.test(trimmedName)) return false;

  // Ensure at least two parts (first and last name)
  const nameParts = trimmedName.split(/\s+/);
  if (nameParts.length < 2) return false;

  let isValid = true;
  // Validate each part of the name using forEach
  nameParts.forEach((part) => {
    if (!/^[A-Z][a-z'.][A-Za-z'.-]*$/.test(part)) {
      isValid = false;
    }
  });

  return isValid;
};
