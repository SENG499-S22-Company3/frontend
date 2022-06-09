import { Course } from "./schedule";

export type Professor = {
  preferences: Preference[];
  coursesCanTeach: Course[];
  displayName: string;
  teachingStatus: string;
  requiredEquipment: string;
  hasPEng: boolean;
  fallTermCourses: number;
  springTermCourses: number;
  summerTermCourses: number;
};

export type Preference = {
  course: Course;
  preferenceNum: number;
};
