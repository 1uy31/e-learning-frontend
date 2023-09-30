import { readonly, Ref, ref, UnwrapRef } from "vue";

export const useState = <T>(initialState: T): [Readonly<Ref>, (newState: UnwrapRef<T>) => void] => {
	const state = ref(initialState);
	const setState = (newState: UnwrapRef<T>) => {
		state.value = newState;
	};

	return [readonly(state), setState];
};

/**
 * * "reducer" must be pure — same inputs always result in the same output.
 * It should not send requests, schedule timeouts, or perform any side effects
 * (operations that impact things outside the component).
 * It should update objects and arrays without mutations.
 *
 * * "action" must be used for a single user interaction, even if that leads to multiple changes in the data.
 * */
export const useReducer = <T, A>(
	reducer: (state: UnwrapRef<T>, action: A) => UnwrapRef<T>,
	initialState: T,
	initializer?: (state: T) => T
): [Readonly<Ref>, (action: A) => void] => {
	const state = ref(initializer ? initializer(initialState) : initialState);
	const dispatch = (action: A) => {
		state.value = reducer(state.value, action);
	};

	return [readonly(state), dispatch];
};
