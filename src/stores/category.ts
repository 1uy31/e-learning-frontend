import { defineStore } from "pinia";
import { Category } from "@appTypes/dataModels";
import { createCategoryService } from "@services/category";

type CategoryStateType = {
	categories: Array<Category>;
	categoriesLoadingError: Error | null;
};

export const useCategoryStore = defineStore("categoryStore", {
	state: (): CategoryStateType => ({
		categories: [],
		categoriesLoadingError: null,
	}),
	getters: {},
	actions: {
		async getCategories() {
			const categoryService = createCategoryService();
			try {
				const result = await categoryService.getAll();
				this.categories = result.categories;
			} catch (error) {
				if (error instanceof Error) {
					this.categoriesLoadingError = error;
				} else {
					throw error;
				}
			}
		},
		async addCategory(name: string, successCreationCallback: () => void, fallbackFunction: (error: Error) => void) {
			const categoryService = createCategoryService();
			try {
				const category = await categoryService.create(name);
				this.categories = [...this.categories, category];
				successCreationCallback();
			} catch (error) {
				if (error instanceof Error) {
					fallbackFunction(error);
				} else {
					throw error;
				}
			}
		},
	},
});
