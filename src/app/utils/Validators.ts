export const setsEqual = (set1: Set<string>, set2: Set<string>) => {
  if (set1.size !== set2.size) return false;
  return Array.from(set1).every((value) => set2.has(value));
};

export const validUsername = (username: string) =>
  /^[a-z0-9]{1,30}$/.test(username);

export const validFullName = (name: string) => {
  const trimmedName = name.trim();
  return (
    trimmedName === name &&
    !/\s{2,}/.test(trimmedName) &&
    trimmedName.split(" ").length >= 2
  );
};
