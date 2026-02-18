import { create } from "zustand";
import api from "@/api/axios";

interface CategoryState {
  categories: string[];
  priorityOrder: string[];
  isLoading: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (category: string) => Promise<void>;
  updatePriority: (priorityOrder: string[]) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  priorityOrder: [],
  isLoading: false,

  fetchCategories: async () => {
    const res = await api.get("/categories")

    const { categories, priorityOrder } = res.data

    const mergedPriority = [
      ...priorityOrder,
      ...categories.filter(cat => !priorityOrder.includes(cat))
    ]

    set({
      categories,
      priorityOrder: mergedPriority
    })
  },


  addCategory: async (name) => {
    const res = await api.post("/categories/add", { category: name })

    set((state) => ({
      categories: res.data,
      priorityOrder: state.priorityOrder.includes(name)
        ? state.priorityOrder
        : [...state.priorityOrder, name]
    }))
  },


  updatePriority: async (priorityOrder) => {
    await api.post("/categories/priority", { priorityOrder });
    set({ priorityOrder });
  },
}));
