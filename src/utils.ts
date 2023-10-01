import { Tab } from "tw-elements";

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
