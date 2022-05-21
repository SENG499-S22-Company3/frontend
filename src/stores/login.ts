import create from "zustand";

type User = {
  username: string;
  email: string;
  roles: string[];
};

type LoginStore = {
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
