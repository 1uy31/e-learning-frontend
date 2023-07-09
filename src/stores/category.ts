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
		increaseDiaryCountForCategory(categoryId: number) {
			const categoryIndex = this.categories.findIndex((category) => category.id === categoryId);
			if (categoryIndex === -1) {
				return;
			}
			const category = this.categories[categoryIndex];
			const replacingCategory: Category = {
				...category,
				diaryCount: category.diaryCount + 1,
			};
			const otherCategories = this.categories.filter((category) => category.id !== categoryId);
			const categoryList = [...otherCategories];
			categoryList.splice(categoryIndex, 0, replacingCategory);
			this.categories = categoryList;
		},
	},
});
