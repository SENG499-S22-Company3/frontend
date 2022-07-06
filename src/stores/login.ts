import create from "zustand";

export type User = {
  username: string;
  name: string;
  email: string;
  roles: string[];
  displayName: string;
};

export type LoginStore = {
  loggedIn: boolean;
  user: User | undefined;
  persistUser: (user: User) => void;
  unPersistUser: () => void;
  fetchUser: () => void;
  setUser: (user: User) => void;
  setLoggedIn: (loggedIn: boolean) => void;
};

export const useLoginStore = create<LoginStore>((set) => ({
  loggedIn: false,
  user: undefined,
  persistUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, loggedIn: true });
  },
  unPersistUser: () => {
    localStorage.removeItem("user");
    set({ user: undefined, loggedIn: false });
  },
  fetchUser: () => {
    const item = localStorage.getItem("user");
    if (item !== null) {
      try {
        const user = JSON.parse(item);
        set({ user, loggedIn: true });
      } catch (e) {
        console.error("Failed to parse JSON user object from local storage", e);
        set({ user: undefined, loggedIn: false });
      }
    } else {
      set({ user: undefined, loggedIn: false });
    }
  },
  setUser: (user) => {
    set({ user });
  },
  setLoggedIn: (loggedIn) => {
    set({ loggedIn });
  },
}));
