import { defineStore } from "pinia";
import { Category } from "@appTypes/dataModels";
import { useCategoryService } from "@services/category";
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
			const categoryService = useCategoryService();
			try {
				const result = await categoryService.getAll();
				this.categories = result.categories;
			} catch (error) {
				const validatedError = validateError(error);
				this.categoriesLoadingError = validatedError;
			}
		},
		async addCategory(successCallback: () => void, failureCallback: (error: Error) => void, name: string) {
			const categoryService = useCategoryService();
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
		increaseNoParentDiaryCount(categoryId: number) {
			const categoryIndex = this.categories.findIndex((category) => category.id === categoryId);
			if (categoryIndex === -1) {
				return;
			}
			const category = this.categories[categoryIndex];
			const replacingCategory: Category = {
				...category,
				noParentDiaryCount: category.noParentDiaryCount + 1,
			};
			const otherCategories = this.categories.filter((category) => category.id !== categoryId);
			const categoryList = [...otherCategories];
			categoryList.splice(categoryIndex, 0, replacingCategory);
			this.categories = categoryList;
		},
	},
});
