import { readonly, Ref, ref, UnwrapRef } from "vue";

export const useState = <T>(initialState: T): [Readonly<Ref>, (newState: UnwrapRef<T>) => void] => {
	const state = ref(initialState);
	const setState = (newState: UnwrapRef<T>) => {
		state.value = newState;
	};

	return [readonly(state), setState];
};

export const useReducer = <T, A>(
	initialState: T,
	reducer: (state: UnwrapRef<T>, action: A) => UnwrapRef<T>,
	initializer?: (state: T) => T
): [Readonly<Ref>, (action: A) => void] => {
	const state = ref(initializer ? initializer(initialState) : initialState);
	const dispatch = (action: A) => {
		state.value = reducer(state.value, action);
	};

	return [readonly(state), dispatch];
};
