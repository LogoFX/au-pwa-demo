export function getAvailableDate() : Date {
  const availableDate = new Date();
  availableDate.setDate(availableDate.getDate() - 1);
  return availableDate;
}
