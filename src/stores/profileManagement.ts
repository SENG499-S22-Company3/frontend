export type UserInfo = {
  username: string;
  displayName: string;
  role: string;
  preferences: [
    {
      id: {
        subject: string;
        code: string;
      };
      preference: number;
    }
  ];
}

