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

export const weekdayToString = (dayOfWeek: number) => {
  if (dayOfWeek === 0) {
    return "SUN";
  }
  if (dayOfWeek === 1) {
    return "MON";
  }
  if (dayOfWeek === 2) {
    return "TUE";
  }
  if (dayOfWeek === 3) {
    return "WED";
  }
  if (dayOfWeek === 4) {
    return "THU";
  }
  if (dayOfWeek === 5) {
    return "FRI";
  }
  return "SAT";
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
