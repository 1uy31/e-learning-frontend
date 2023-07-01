import { defineStore } from "pinia";
import { Category } from "@appTypes/dataModels";
import { createCategoryService } from "@services/category";
import { validateError } from "@src/utils";

type CategoryStateType = {
	categories: Array<Category>;
	categoriesLoadingError: Error | null;
	selectedCategory?: Category;
};

export const useCategoryStore = defineStore("categoryStore", {
	state: (): CategoryStateType => ({
		categories: [],
		categoriesLoadingError: null,
		selectedCategory: undefined,
	}),
	getters: {},
	actions: {
		async getCategories() {
			const categoryService = createCategoryService();
			try {
				const result = await categoryService.getAll();
				this.categories = result.categories;
			} catch (error) {
				const validatedError = validateError(error);
				this.categoriesLoadingError = validatedError;
			}
		},
		async addCategory(successCallback: () => void, failureCallback: (error: Error) => void, name: string) {
			const categoryService = createCategoryService();
			try {
				const category = await categoryService.create(name);
				this.categories = [...this.categories, category];
				successCallback();
			} catch (error) {
				const validatedError = validateError(error);
				failureCallback(validatedError);
			}
		},
		selectCategory(category?: Category) {
			this.selectedCategory = category;
		},
	},
});
