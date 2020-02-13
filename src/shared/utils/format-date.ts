import { Moment } from "moment";

export function formatDate(date: Moment | Date): string {
  let d: Date;
  if (date instanceof Date) {
    d = date;
  } else {
    d = date.toDate();
  }

  let month = `${(d.getMonth() + 1)}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) {
      month = `0${month}`;
  }

  if (day.length < 2) {
      day = `0${day}`;
  }

  return [year, month, day].join('-');
}
