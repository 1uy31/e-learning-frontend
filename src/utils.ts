import { Tab } from "tw-elements";
import { Note } from "@appTypes/dataModels";

export const validateError = <T>(error: T): Error => {
	if (error instanceof Error) {
		return error;
	}
	throw error;
};

export const alertIfNullUndefined = <T>(entity: T, entityName?: string, alertMessage?: string): NonNullable<T> => {
	// null == undefined
	if (entity == null) {
		const message = alertMessage || `${entityName || "An expected entity"} is null or undefined.`;
		window.alert(message);
		throw Error(message);
	}
	return entity;
};

export const displayDatetime = (datetimeString: string) => {
	const datetime = new Date(datetimeString);
	return datetime.toLocaleString("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
};

export const showTabById = (elementId: string) => {
	const tabElement = alertIfNullUndefined(document.getElementById(elementId), `Element with ID ${elementId}`);
	const tab = new Tab(tabElement);
	tab.show();
};

/**
 * - Pre-select the diary field.
 * - Pre-set the position field.
 */
export const presetNoteCreationFormFields = (notesByDiary: Record<number, Array<Note>>, selectedDiaryId?: number) => {
	presetSelectionField("id_new_note_field_diary", selectedDiaryId);
	// It is safe to cast below fields' type according to their declaration.
	const positionField = document.getElementById("id_new_note_field_note_position") as HTMLInputElement | null;
	if (!selectedDiaryId || !positionField) {
		return;
	}
	const usedNotePositions = notesByDiary[selectedDiaryId]?.map((note) => note.notePosition);
	positionField.value = usedNotePositions ? `${Math.max(0, ...usedNotePositions) + 1}` : "1";
	positionField.dispatchEvent(new Event("change"));
};

export const presetSelectionField = (selectionFieldId: string, selectedValue?: number) => {
	// It is safe to cast the fields' type to HTMLSelectElement.
	const selectionField = document.getElementById(`${selectionFieldId}`) as HTMLSelectElement | null;

	if (!selectionField || !selectedValue) {
		return;
	}
	const matchedOptionIndex = Array.from(selectionField?.options || []).findIndex(
		(option) => Number(option.value) === selectedValue
	);
	if (matchedOptionIndex !== -1) {
		selectionField.options[matchedOptionIndex].selected = true;
		selectionField.dispatchEvent(new Event("change"));
	}
};
