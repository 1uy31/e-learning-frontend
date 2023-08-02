import { defineStore } from "pinia";
import { Diary, DiaryInput } from "@appTypes/dataModels";
import { validateError } from "@src/utils";
import { useDiaryService } from "@services/diary";
import { useCategoryStore } from "@stores/category";

type DiaryStateType = {
	diariesByCategory: Record<number, Array<Diary>>;
	loadingDiaries: boolean;
	diariesLoadingError: Error | null;
	selectedDiary?: Diary;
	loadingChildDiaries: boolean;
	childDiariesByDiary: Record<number, Array<Diary>>;
	diaries: Array<Diary>;
};

export const useDiaryStore = defineStore("diaryStore", {
	state: (): DiaryStateType => ({
		diariesByCategory: {},
		loadingDiaries: false,
		diariesLoadingError: null,
		selectedDiary: undefined,
		loadingChildDiaries: false,
		childDiariesByDiary: {},
		diaries: [],
	}),
	getters: {},
	actions: {
		async getDiariesByCategory(categoryId: number) {
			const diaryService = useDiaryService();
			try {
				this.loadingDiaries = true;
				const diaries = await diaryService.getMatchedObjects(categoryId, null);
				this.diariesByCategory[categoryId] = diaries;
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
				if (diary.parentDiaryId || !diary.categoryId) {
					return successCallback();
				}
				const categoryStore = useCategoryStore();
				categoryStore.increaseNoParentDiaryCount(diary.categoryId);
				if (this.diariesByCategory[diary.categoryId]) {
					this.diariesByCategory[diary.categoryId] = [...this.diariesByCategory[diary.categoryId], diary];
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
		async getChildDiariesByDiary(diary: Diary) {
			const diaryService = useDiaryService();
			try {
				this.loadingChildDiaries = true;
				const diaries = await diaryService.getMatchedObjects(diary.categoryId, diary.id);
				this.childDiariesByDiary[diary.id] = diaries;
				this.loadingChildDiaries = false;
			} catch (error) {
				this.loadingChildDiaries = false;
				const validatedError = validateError(error);
				this.diariesLoadingError = validatedError;
			}
		},
		async getAllDiaries() {
			const diaryService = useDiaryService();
			try {
				this.loadingDiaries = true;
				const diaries = await diaryService.getMatchedObjects();
				this.diaries = diaries;
				this.loadingDiaries = false;
			} catch (error) {
				this.loadingDiaries = false;
				const validatedError = validateError(error);
				this.diariesLoadingError = validatedError;
			}
		},
		/**
		 * Only for use when all diaries have been fetched or childDiariesByDiary has been fetched for the diaryId.
		 * **/
		hasChildDiary(diaryId: number) {
			if (this.diaries.length > 0) {
				const childDiaryIndex = this.diaries.findIndex((diary) => diary.parentDiaryId === diaryId);
				return childDiaryIndex !== -1;
			}

			if (!Object.keys(this.childDiariesByDiary).includes(`${diaryId}`)) {
				return false;
			}
			return this.childDiariesByDiary[diaryId].length > 0;
		},
	},
});
