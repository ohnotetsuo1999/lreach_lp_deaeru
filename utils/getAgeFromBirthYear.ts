export function getAgeFromBirthYear(birthYear: number): number {
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}
