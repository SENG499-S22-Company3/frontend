import { User } from "./login";

//this is the type that devExtreme expects
export type Appointment = {
  id: number;
  code: string;
  term: string;
  title: string;
  subject: string;
  hoursPerWeek: number;
  sectionNumber: string;
  professors: string[]; //usually assumed to be one max
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
  sectionNumber: string;
  hoursPerWeek: number;
  capacity: number;
  professors: User[];
  startDate: Date;
  endDate: Date;
  meetingTimes: MeetingTime[];
};

export type CourseID = {
  code: string;
  title: string;
  subject: string;
  term: string;
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

//types for schedule editing

export type UpdateScheduleInput = {
  id: Number;
  courses: CourseSectionInput[];
  skipValidation: Boolean;
  validation: Company;
};

export type CourseSectionInput = {
  id: CourseID;
  sectionNumber: string;
  hoursPerWeek: number;
  capacity: number;
  professors: String[]; //usernames
  startDate: Date;
  endDate: Date;
  meetingTimes: MeetingTimeInput[];
};

export type MeetingTimeInput = {
  day: DayInput;
  startTime: Date;
  endTime: Date;
};

export enum DayInput {
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY,
}

export enum Company {
  COMPANY3,
  COMPANY4,
}
