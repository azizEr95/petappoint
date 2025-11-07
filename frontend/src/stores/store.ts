import { create } from "zustand";

type store = {
    searchName: string
    searchOrt: string
    setSearchName: (such: string) => void
    setSearchOrt: (such: string) => void
}

export const useStore = create<store>((set) => ({
    searchName: "",
    searchOrt: "",
    setSearchName: (name) => set({ searchName: name }),
    setSearchOrt: (ort) => set({ searchOrt: ort })
})
);