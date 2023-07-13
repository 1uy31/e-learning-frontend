import { defineStore } from "pinia";
import { Diary, DiaryInput } from "@appTypes/dataModels";
import { validateError } from "@src/utils";
import { useDiaryService } from "@services/diary";
import { useCategoryStore } from "@stores/category";

type DiaryStateType = {
	firstLayerDiariesByCategory: Record<number, Array<Diary>>;
	loadingDiaries: boolean;
	diariesLoadingError: Error | null;
	selectedDiary?: Diary;
};

export const useDiaryStore = defineStore("diaryStore", {
	state: (): DiaryStateType => ({
		firstLayerDiariesByCategory: {},
		loadingDiaries: false,
		diariesLoadingError: null,
		selectedDiary: undefined,
	}),
	getters: {},
	actions: {
		async getFirstLayerDiariesByCategory(categoryId: number) {
			const diaryService = useDiaryService();
			try {
				this.loadingDiaries = true;
				const diaries = await diaryService.getByCategorizedTopic(categoryId);
				this.firstLayerDiariesByCategory[categoryId] = diaries;
				this.loadingDiaries = false;
			} catch (error) {
				this.loadingDiaries = false;
				const validatedError = validateError(error);
				this.diariesLoadingError = validatedError;
			}
		},
		async addDiary(successCallback: () => void, failureCallback: (error: Error) => void, input: DiaryInput) {
			const diaryService = useDiaryService();
			try {
				const diary = await diaryService.create(input);
				if (diary.categoryId && this.firstLayerDiariesByCategory[diary.categoryId]) {
					this.firstLayerDiariesByCategory[diary.categoryId] = [
						...this.firstLayerDiariesByCategory[diary.categoryId],
						diary,
					];
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
		selectDiary(diary?: Diary) {
			this.selectedDiary = diary;
		},
	},
});
