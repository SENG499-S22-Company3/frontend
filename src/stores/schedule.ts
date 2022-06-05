//The below types are derived from Algorithm 1's specifications
export type Assignment = {
    course: Course;
    professor: Professor;
    startDate: string; // Follow "yyyy-mm-dd"
    endDate: string; // Follow "yyyy-mm-dd"
    beginTime: string; // Use 24hr "0000" - "2359"
    endTime: string; // Use 24hr "0000" - "2359"
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
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