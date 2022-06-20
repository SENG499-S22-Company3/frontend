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
