//The below types are derived from Algorithm 1's specifications
//For now, course, professor and the dates are using easier types to work with, just to assist with mock data.
//In the future remove those though

export type Assignment = {
    course: Course | string;
    professor: Professor | string;
    startDate: string | Date; // Follow "yyyy-mm-dd"
    endDate: string | Date; // Follow "yyyy-mm-dd"
    beginTime: string; // Use 24hr "0000" - "2359"
    endTime: string; // Use 24hr "0000" - "2359"
    monday?: boolean;
    tuesday?: boolean;
    wednesday?: boolean;
    thursday?: boolean;
    friday?: boolean;
};

export type Course = {
    courseNumber: number;
    subject: string;
    sequenceNumber: string;
    courseTitle: string;
    requiredEquipment: string[];
    requiresPEng: boolean;
}

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
}