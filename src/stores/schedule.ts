import { User } from "./login";

//this is the type that devExtreme expects
export type Appointment = {
  startDate: Date; //both day and time
  endDate: Date; //both day and time
  courseTitle: string;
  courseNumber: string;
  subject: string;
  section: string;
  prof: string[];
  classSize: number; //from algo2
};

//from backends GraphQL schema

export type Schedule = {
  id: string;
  year: number;
  createdAt: Date;
  courses: CourseSection[];
};

export type CourseSection = {
  CourseID: CourseID;
  hoursPerWeek: number;
  capacity: number;
  professors: User[];
  startDate: Date;
  endDate: Date;
  meetingTimes: MeetingTime[];
};

export type CourseID = {
  code: string;
  subject: string;
  term: string;
  title: string; //not currently in schema
  section: string; //not currently in schema
};

export type MeetingTime = {
  day: Day;
  startTime: String; //Schema has this as Date, but shouldn't this be string??
  endTime: String; //Schema has this as Date, but shouldn't this be string??
};

export enum Day {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}
