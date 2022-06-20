import create from "zustand";

export type User = {
  username: string;
  name: string;
  email: string;
  roles: string[];
  displayName: string; //not currently in schema
};

export type LoginStore = {
  loggedIn: boolean;
  user: User | undefined;
  setUser: (user: User) => void;
  setLoggedIn: (loggedIn: boolean) => void;
};

export const useLoginStore = create<LoginStore>((set) => ({
  loggedIn: false,
  user: undefined,
  setUser: (user) => {
    set({ user });
  },
  setLoggedIn: (loggedIn) => {
    set({ loggedIn });
  },
}));
