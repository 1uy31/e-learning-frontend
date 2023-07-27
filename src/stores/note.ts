import { defineStore } from "pinia";
import { NoteInput } from "@appTypes/dataModels";
import { validateError } from "@src/utils";
import { useNoteService } from "@services/note";

// eslint-disable-next-line @typescript-eslint/ban-types
type NoteStateType = {};

export const useNoteStore = defineStore("noteStore", {
	state: (): NoteStateType => ({}),
	getters: {},
	actions: {
		async addNote(successCallback: () => void, failureCallback: (error: Error) => void, input: NoteInput) {
			const noteService = useNoteService();
			try {
				const note = await noteService.create(input);
				console.log(note);
				successCallback();
			} catch (error) {
				const validatedError = validateError(error);
				failureCallback(validatedError);
			}
		},
	},
});
