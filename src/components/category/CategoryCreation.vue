<script setup lang="ts">
import { useCategoryStore } from "@stores/category";
import { onMounted } from "vue";

const categoryStore = useCategoryStore();

onMounted(() => {
	const input = document.querySelector("nord-input");
	const button = document.querySelector("nord-button");

	if (!input || !button) {
		window.alert("Could not load category creation form, please reload.");
		return;
	}

	const successfulCreationCallback = () => {
		button.disabled = true;
		input.value = "";
		input.error = "";
	};
	const failedCreationCallback = (error: Error) => {
		input.error = error.message;
	};

	if (!input.value) {
		button.disabled = true;
	}

	input.addEventListener("change", (event) => {
		input.error = "";
		if ((<HTMLInputElement | null>event.target)?.value) {
			button.disabled = false;
		} else {
			button.disabled = true;
		}
	});

	button.addEventListener("click", async () => {
		if (button.loading) {
			return;
		}
		button.loading = true;
		await categoryStore.addCategory(successfulCreationCallback, failedCreationCallback, input.value);
		button.loading = false;
	});
});
</script>

<template>
	<nord-input slot="end" type="text" label="New category" value="" placeholder="Category name">
		<nord-button slot="end" aria-describedby="id_new_category_tooltip" variant="primary">
			<nord-icon name="interface-add" size="l"></nord-icon>
		</nord-button>
	</nord-input>
	<nord-tooltip id="id_new_category_tooltip">Create a new category</nord-tooltip>
</template>

<style scoped></style>
