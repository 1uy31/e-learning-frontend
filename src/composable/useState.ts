import { readonly, Ref, ref, UnwrapRef } from "vue";

export function useState<T>(initialState: T): [Readonly<Ref>, CallableFunction] {
	const state = ref(initialState);
	const setState = (newState: UnwrapRef<T>) => {
		state.value = newState;
	};

	return [readonly(state), setState];
}
