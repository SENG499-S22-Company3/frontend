import { Day } from "../stores/schedule";

export const weekdayToInt = (dayOfWeek: Day) => {
  if (dayOfWeek === Day.MONDAY) {
    return 0;
  }
  if (dayOfWeek === Day.TUESDAY) {
    return 1;
  }
  if (dayOfWeek === Day.WEDNESDAY) {
    return 2;
  }
  if (dayOfWeek === Day.THURSDAY) {
    return 3;
  }
  if (dayOfWeek === Day.FRIDAY) {
    return 4;
  }
  if (dayOfWeek === Day.SATURDAY) {
    return 5;
  }
  return 6;
};

export const weekdayToString = (dayOfWeek: number): Day => {
  if (dayOfWeek === 0) {
    return Day.SUNDAY;
  }
  if (dayOfWeek === 1) {
    return Day.MONDAY;
  }
  if (dayOfWeek === 2) {
    return Day.TUESDAY;
  }
  if (dayOfWeek === 3) {
    return Day.WEDNESDAY;
  }
  if (dayOfWeek === 4) {
    return Day.THURSDAY;
  }
  if (dayOfWeek === 5) {
    return Day.FRIDAY;
  }
  return Day.SATURDAY;
};

export const weekdayShortToLong = (dayOfWeek: string) => {
  if (dayOfWeek === "MON") {
    return Day.MONDAY;
  }
  if (dayOfWeek === "TUE") {
    return Day.TUESDAY;
  }
  if (dayOfWeek === "WED") {
    return Day.WEDNESDAY;
  }
  if (dayOfWeek === "THU") {
    return Day.THURSDAY;
  }
  if (dayOfWeek === "FRI") {
    return Day.FRIDAY;
  }
  if (dayOfWeek === "SAT") {
    return Day.SATURDAY;
  }
  return Day.SUNDAY;
};
