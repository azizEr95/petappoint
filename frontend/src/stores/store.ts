import { create } from "zustand";

type authStore = {
    login: boolean;
    setLogin: (log: boolean) => void
}

export const useAuthStore = create<authStore>((set) => ({
    login: false,
    setLogin: (log) => set({login: log})
})
);