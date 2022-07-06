import { User } from "./login";

//this is the type that devExtreme expects
export type Appointment = {
  id: number;
  title: string;
  code: string;
  term: string;
  subject: string;
  section: string;
  professors: string[];
  capacity: number; //from algo2
  startTime: Date; //for table view
  endTime: Date; //for table view
  startDate?: Date; //both day and time
  endDate?: Date; //both day and time
};

//from backends GraphQL schema

export type Schedule = {
  id: string;
  year: number;
  createdAt: Date;
  courses: CourseSection[];
};

export type CourseSection = {
  id: number;
  CourseID: CourseID;
  section: string; //not currently in schema
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
};

export type MeetingTime = {
  day: Day;
  startTime: Date;
  endTime: Date;
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
