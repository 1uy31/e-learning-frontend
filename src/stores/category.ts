import { defineStore } from "pinia";
import { Category } from "@appTypes/dataModels";

export const useCategoryStore = defineStore("categoryStore", {
	state: () => ({
		categories: [] as Array<Category>,
	}),
	actions: {
		addCategory(category: Category) {
			this.categories.push(category);
		},
	},
});
