export const validateError = <T>(error: T): Error => {
	if (error instanceof Error) {
		return error;
	}
	throw error;
};

export const alertIfNullUndefined = <T>(entity: T, entityName: string): NonNullable<T> => {
	// null == undefined
	if (entity == null) {
		const message = `${entityName} is null or undefined.`;
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
