import { defineStore } from "pinia";
import { Diary, Note, NoteInput } from "@appTypes/dataModels";
import { validateError } from "@src/utils";
import { useNoteService } from "@services/note";

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
		async getNotesByDiary(diary: Diary) {
			const noteService = useNoteService();
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
		async addNote(successCallback: () => void, failureCallback: (error: Error) => void, input: NoteInput) {
			const noteService = useNoteService();
			try {
				const note = await noteService.create(input);
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
