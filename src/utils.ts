export const validateError = <T>(error: T): Error => {
	if (error instanceof Error) {
		return error;
	}
	throw error;
};
