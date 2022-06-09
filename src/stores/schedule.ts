//this is the type that devExtreme expects
export type Appointment = {
  startDate: Date; //both day and time
  endDate: Date; //both day and time
  courseTitle: string;
  courseNumber: string;
  subject: string;
  sequenceNumber: string;
  prof: string;
  classSize: number; //from algo2
};


//The below types are derived from Algorithm 1's specifications
export type Assignment = {
  startDate: string; // Follow "yyyy-mm-dd"
  endDate: string; // Follow "yyyy-mm-dd"
  beginTime: string; // Use 24hr "0000" - "2359"
  endTime: string; // Use 24hr "0000" - "2359"
  hoursWeek: number; 
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
};


export type Course = {
  courseNumber: string;
  subject: string;
  sequenceNumber: string; //eg. A01
  courseTitle: string;
  prof: string;
  meetingTime: Assignment;
};

//from algorithm one we will be getting a Schedule object
export type ScheduleAssignment = {
  fallTermCourses: Course[];
  springTermCourses: Course[];
  summerTermCourses: Course[];
}
