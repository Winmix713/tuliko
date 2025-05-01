// src/store/index.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { generateId } from '@/lib/utils';
import { demoCategories } from '@/config/components'; // <-- IMPORT DEMO DATA

export interface ComponentItem {
  id: string;
  name: string;
  description: string;
  code: string;
  preview: React.ReactNode;
  category?: string;
  tags?: string[];
  author?: string;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  items: ComponentItem[];
}

export interface ComponentStoreState {
  categories: Category[];
  activeComponent: ComponentItem | null;
  searchQuery: string;
  favorites: string[];

  // Actions
  initialize: () => void;
  setCategories: (categories: Category[]) => void;
  setActiveComponent: (component: ComponentItem | null) => void;
  addCategory: (category: Omit<Category, 'id' | 'items'>) => string;
  removeCategory: (categoryId: string) => void;
  addComponent: (categoryId: string, component: Omit<ComponentItem, 'id'>) => string;
  updateComponent: (categoryId: string, component: ComponentItem) => void;
  removeComponent: (categoryId: string, componentId: string) => void;
  toggleFavorite: (componentId: string) => void;
  setSearchQuery: (query: string) => void;

  // Getters
  getFilteredComponents: () => ComponentItem[];
  getFavoriteComponents: () => ComponentItem[];
  getCategoryById: (id: string) => Category | undefined;
  getComponentById: (id: string) => ComponentItem | undefined;
}

export const useComponentStore = create<ComponentStoreState>()(
  persist(
    (set, get) => ({
      categories: [],
      activeComponent: null,
      searchQuery: '',
      favorites: [],

      // New initialization method
      initialize: () => {
        set({ categories: demoCategories });
      },

      setCategories: (categories) => set({ categories }),

      setActiveComponent: (component) => set({ activeComponent: component }),

      addCategory: (category) => {
        const id = generateId();
        set((state) => ({
          categories: [...state.categories, { ...category, id, items: [] }]
        }));
        return id;
      },

      removeCategory: (categoryId) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== categoryId)
        }));
      },

      addComponent: (categoryId, component) => {
        const id = generateId();
        const now = new Date().toISOString();

        const newComponent = {
          ...component,
          id,
          createdAt: now,
          updatedAt: now
        };

        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === categoryId
              ? { ...cat, items: [...cat.items, newComponent] }
              : cat
          )
        }));

        return id;
      },

      updateComponent: (categoryId, component) => {
        set((state) => ({
          categories: state.categories.map((cat) => {
            if (cat.id === categoryId) {
              return {
                ...cat,
                items: cat.items.map((item) =>
                  item.id === component.id
                    ? { ...component, updatedAt: new Date().toISOString() }
                    : item
                )
              };
            }
            return cat;
          }),
          activeComponent: state.activeComponent?.id === component.id
            ? { ...component, updatedAt: new Date().toISOString() }
            : state.activeComponent
        }));
      },

      removeComponent: (categoryId, componentId) => {
        set((state) => ({
          categories: state.categories.map((cat) => {
            if (cat.id === categoryId) {
              return {
                ...cat,
                items: cat.items.filter((item) => item.id !== componentId)
              };
            }
            return cat;
          }),
          activeComponent: state.activeComponent?.id === componentId
            ? null
            : state.activeComponent
        }));
      },

      toggleFavorite: (componentId) => {
        set((state) => ({
          favorites: state.favorites.includes(componentId)
            ? state.favorites.filter((id) => id !== componentId)
            : [...state.favorites, componentId]
        }));
      },

      setSearchQuery: (query) => set({ searchQuery: query }),

      getFilteredComponents: () => {
        const state = get();
        const query = state.searchQuery.toLowerCase();
        if (!query) return [];

        return state.categories.flatMap((cat) =>
          cat.items.filter((item) =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(query)))
          )
        );
      },

      getFavoriteComponents: () => {
        const state = get();
        return state.categories.flatMap((cat) => cat.items)
          .filter((item) => state.favorites.includes(item.id));
      },

      getCategoryById: (id) => get().categories.find((cat) => cat.id === id),

      getComponentById: (id) =>
        get().categories.flatMap((cat) => cat.items).find((item) => item.id === id)
    }),
    {
      name: 'component-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
