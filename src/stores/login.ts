import create from "zustand";

type User = {
  username: string;
  email: string;
  roles: string[];
};

const testUser = {
  username: "testuser",
  email: "test@test.ca",
  roles: ["professor"],
};

type LoginStore = {
  loggedIn: boolean;
  user: User | undefined;
  updateUser: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useLoginStore = create<LoginStore>((set) => ({
  loggedIn: false,
  user: undefined,
  updateUser: async () => {
    // TODO: Hook this up to GraphQL
    const user = testUser;
    set({ user, loggedIn: user !== undefined });
  },
  login: async (_username, _password) => {
    // TODO: Hook this up to GraphQL
    const user = testUser;
    set({ loggedIn: true, user });
  },
  logout: async () => {
    // TODO: Hook this up to GraphQL
    set({ loggedIn: false, user: undefined });
  },
}));
