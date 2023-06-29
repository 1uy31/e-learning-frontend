import { defineStore } from "pinia";
import { Category } from "@appTypes/dataModels";
import { createCategoryService } from "@services/category";
import { validateError } from "@src/utils";

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
				const validatedError = validateError(error);
				this.categoriesLoadingError = validatedError;
			}
		},
		async addCategory(name: string, successCallback: () => void, failureCallback: (error: Error) => void) {
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
	},
});
