import { CourseSection } from "./schedule";

//This is pretty deprecated and not very useful, the GraphQL schema is completely different than this.
export type Professor = {
  preferences: Preference[];
  coursesCanTeach: CourseSection[];
  displayName: string;
  teachingStatus: string;
  requiredEquipment: string;
  hasPEng: boolean;
  fallTermCourses: number;
  springTermCourses: number;
  summerTermCourses: number;
};

export type Preference = {
  course: CourseSection;
  preferenceNum: number;
};
