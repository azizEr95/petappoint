import { create } from "zustand";

type store = {
    search: string;
    setSearch: (such: string) => void
}

export const useStore = create<store>((set) => ({
    search: "",
    setSearch: (such) => set({ search: such })
})
);