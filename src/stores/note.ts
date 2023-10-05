import { defineStore } from "pinia";
import { Diary, Note, NoteInput } from "@appTypes/dataModels";
import { validateError } from "@src/utils";
import { useNoteService } from "@services/note";
import { useDiaryStore } from "@stores/diary";

type NoteStateType = {
	loadingNote: boolean;
	notesByDiary: Record<number, Array<Note>>;
	notesLoadingError?: Error;
	selectedNote?: Note;
};

export const useNoteStore = defineStore("noteStore", {
	state: (): NoteStateType => ({
		loadingNote: false,
		notesByDiary: {},
		notesLoadingError: undefined,
		selectedNote: undefined,
	}),
	getters: {},
	actions: {
		async getNotesByDiary(diary: Diary, noteService = useNoteService()) {
			try {
				this.loadingNote = true;
				const result = await noteService.getMatchedObjects(diary.id);
				this.notesByDiary[diary.id] = result.notes;
				this.loadingNote = false;
			} catch (error) {
				this.loadingNote = false;
				const validatedError = validateError(error);
				this.notesLoadingError = validatedError;
			}
		},
		async getNotesByDiaryId(diaryId: number, diaryStore = useDiaryStore()) {
			const { diaries } = diaryStore;
			const diary = diaries.find((_diary) => _diary.id === diaryId);
			if (diary) {
				await this.getNotesByDiary(diary);
			}
		},
		async addNote(
			successCallback: () => void,
			failureCallback: (error: Error) => void,
			input: NoteInput,
			noteService = useNoteService()
		) {
			try {
				await noteService.create(input);
				successCallback();
			} catch (error) {
				const validatedError = validateError(error);
				failureCallback(validatedError);
			}
		},
		selectNote(note: Note) {
			this.selectedNote = note;
		},
	},
});
