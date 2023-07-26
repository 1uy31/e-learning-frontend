<script setup lang="ts">
import { useCategoryStore } from "@stores/category";
import { onMounted } from "vue";
import { Input, Ripple, initTE } from "tw-elements";
import SmallSpinner from "@components/share/SmallSpinner.vue";
import { useState } from "@src/composable/useState";
import { MEDIUM_TIMING } from "@src/constants/timing";

const categoryStore = useCategoryStore();

const [formMessage, setFormMessage] = useState({ message: "", class: "" });
const [categoryName, setCategoryName] = useState("");
const [isCreatingCategory, toggleIsCreatingCategory] = useState(false);

const successfulCreationCallback = () => {
	setCategoryName("");
	setFormMessage({ message: "New category created successfully.", class: "text-green-800" });
	setTimeout(() => setFormMessage({ message: "", class: "" }), MEDIUM_TIMING);
};

const submitNewCategory = async () => {
	if (["", undefined].includes(categoryName.value) || isCreatingCategory.value) {
		return;
	}
	toggleIsCreatingCategory(true);
	await categoryStore.addCategory(
		successfulCreationCallback,
		(error: Error) => setFormMessage({ message: error.message, class: "text-red-800" }),
		categoryName.value
	);
	toggleIsCreatingCategory(false);
};

onMounted(() => {
	initTE({ Input, Ripple });
});
</script>

<template>
	<div
		class="mx-auto mt-12 block rounded-lg bg-stone-100 p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12"
	>
		<form>
			<p v-if="formMessage.message" :class="'text-l mb-5 ' + formMessage.class">{{ formMessage.message }}</p>
			<div class="relative mb-5 mt-2" data-te-input-wrapper-init>
				<input
					id="id_new_category_name"
					type="text"
					class="peer block min-h-[auto] w-full rounded bg-transparent px-3 py-[0.32rem] leading-[2.15] text-cyan-950 outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
					placeholder="A unique name"
					:value="categoryName"
					@change="(event) => setCategoryName(event.target.value)"
				/>
				<label
					for="id_new_category_name"
					class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-cyan-700 transition-all duration-200 ease-out peer-focus:translate-y-[-1.15rem] peer-focus:scale-[0.8] peer-focus:text-cyan-800 peer-data-[te-input-state-active]:translate-y-[-1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
					>Category name
				</label>
			</div>

			<button
				type="button"
				class="rounded bg-cyan-800 px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-cyan-900 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-cyan-900 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-cyan-900 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] disabled:bg-gray-400"
				data-te-ripple-init
				data-te-ripple-color="light"
				:disabled="['', undefined].includes(categoryName)"
				@click.prevent="submitNewCategory"
			>
				<SmallSpinner v-if="isCreatingCategory" status="Creating" />
				{{ !isCreatingCategory ? "Create" : "" }}
			</button>
		</form>
	</div>
</template>

<style scoped></style>
