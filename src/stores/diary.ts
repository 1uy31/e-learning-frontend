import { defineStore } from "pinia";
import { Diary, DiaryInput } from "@appTypes/dataModels";
import { validateError } from "@src/utils";
import { createDiaryService } from "@services/diary";

type DiaryStateType = {
	diaries: Array<Diary>;
	diariesLoadingError: Error | null;
};

export const useDiaryStore = defineStore("diaryStore", {
	state: (): DiaryStateType => ({
		diaries: [],
		diariesLoadingError: null,
	}),
	getters: {},
	actions: {
		async addDiary(successCallback: () => void, failureCallback: (error: Error) => void, input: DiaryInput) {
			const diaryService = createDiaryService();
			try {
				const diary = await diaryService.create(input);
				this.diaries = [...this.diaries, diary];
				successCallback();
			} catch (error) {
				const validatedError = validateError(error);
				failureCallback(validatedError);
			}
		},
	},
});
