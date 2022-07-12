export type UserInfo = {
  username: string;
  displayName: string;
  role: string;
  preferences: Preference[];
};

export type Preference = {
  id: CourseID;
  preference: number;
};

type CourseID = {
  subject: string;
  code: string;
};
