import { defineStore } from "pinia";
import { Diary, DiaryInput } from "@appTypes/dataModels";
import { validateError } from "@src/utils";
import { createDiaryService } from "@services/diary";
import { useCategoryStore } from "@stores/category";

type DiaryStateType = {
	diariesByCategory: Record<number, Array<Diary>>;
	loadingDiaries: boolean;
	diariesLoadingError: Error | null;
};

export const useDiaryStore = defineStore("diaryStore", {
	state: (): DiaryStateType => ({
		diariesByCategory: {},
		loadingDiaries: false,
		diariesLoadingError: null,
	}),
	getters: {},
	actions: {
		async getByCategorizedTopic(categoryId: number) {
			const diaryService = createDiaryService();
			try {
				this.loadingDiaries = true;
				const diaries = await diaryService.getByCategorizedTopic(categoryId);
				this.diariesByCategory[categoryId] = diaries;
				this.loadingDiaries = false;
			} catch (error) {
				this.loadingDiaries = false;
				const validatedError = validateError(error);
				this.diariesLoadingError = validatedError;
			}
		},

		async addDiary(successCallback: () => void, failureCallback: (error: Error) => void, input: DiaryInput) {
			const diaryService = createDiaryService();
			try {
				const diary = await diaryService.create(input);
				if (diary.categoryId && this.diariesByCategory[diary.categoryId]) {
					this.diariesByCategory[diary.categoryId] = [...this.diariesByCategory[diary.categoryId], diary];
				} else if (diary.categoryId) {
					const categoryStore = useCategoryStore();
					categoryStore.increaseDiaryCountForCategory(diary.categoryId);
				}
				successCallback();
			} catch (error) {
				const validatedError = validateError(error);
				failureCallback(validatedError);
			}
		},
	},
});
