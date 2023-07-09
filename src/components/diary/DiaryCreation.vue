<script setup lang="ts">
import { useCategoryStore } from "@stores/category";
import { useDiaryStore } from "@stores/diary";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { MEDIUM_TIMING } from "@src/constants/timing";

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);

const diaryStore = useDiaryStore();
const DEFAULT_RATE = "3";

const submitDiaryCreationForm = async (event: SubmitEvent) => {
	const form = <HTMLFormElement>document.getElementById("id_diary_creation_form");
	const formBanner = form?.querySelector("nord-banner");
	const submitButton = form?.querySelector("nord-button");

	if (!form || !formBanner || !submitButton || submitButton.loading) {
		return;
	}

	const successfulCreationCallback = () => {
		formBanner.variant = "success";
		formBanner.innerHTML = "Diary created successfully.";
		formBanner.style.display = "block";

		const categorySelection = form.querySelectorAll("nord-select")[0];
		categorySelection.value = categories.value.length > 0 ? `${categories.value[0].id}` : "";

		const textInputs = form.querySelectorAll("nord-input");
		textInputs.forEach((textInput) => (textInput.value = ""));
		const rate = form.querySelectorAll("nord-range")[0];
		rate.value = DEFAULT_RATE;

		setTimeout(() => {
			formBanner.style.display = "none";
		}, MEDIUM_TIMING);
	};

	const failedCreationCallback = (error: Error) => {
		formBanner.variant = "danger";
		formBanner.innerHTML = error.message;
		formBanner.style.display = "block";
	};

	const formInput = new FormData(<HTMLFormElement>event.target);
	const entries = [...formInput.entries()].reduce(
		(object, entry) => Object.assign(object, { [entry[0]]: entry[1] }),
		{}
	);

	if (!Object.keys(entries).includes("categoryId")) {
		entries["categoryId"] = categories.value[0]?.id;
	}

	submitButton.loading = true;
	await diaryStore.addDiary(successfulCreationCallback, failedCreationCallback, {
		...entries,
		categoryId: Number(entries.categoryId),
		rate: Number(entries.rate),
	});
	submitButton.loading = false;
};

onMounted(() => {
	const form = document.getElementById("id_diary_creation_form");
	const formBanner = form?.querySelector("nord-banner");
	const topicInput = form?.querySelectorAll("nord-input")[0];
	const submitButton = form?.querySelector("nord-button");

	if (!formBanner || !topicInput || !submitButton) {
		window.alert("Could not load diary creation form, please reload.");
		return;
	}

	topicInput.addEventListener("change", (event) => {
		if ((<HTMLInputElement | null>event.target)?.value) {
			submitButton.disabled = false;
		} else {
			submitButton.disabled = true;
		}
	});
});
</script>

<template>
	<nord-card padding="l">
		<h1 slot="header">New diary</h1>
		<form id="id_diary_creation_form" @submit.prevent="submitDiaryCreationForm">
			<nord-stack>
				<nord-banner shadow style="display: none"></nord-banner>
				<nord-select name="categoryId" label="Category" expand>
					<option v-for="category in categories" :key="category.id" :value="category.id">
						{{ category.name }}
					</option>
				</nord-select>

				<nord-input
					name="topic"
					label="Topic"
					expand
					required
					type="text"
					maxlength="2"
					placeholder="Learning topic"
				></nord-input>

				<nord-input
					name="sourceUrl"
					label="Source url"
					expand
					type="url"
					placeholder="https://www.wikipedia.org/"
				>
				</nord-input>

				<nord-range
					name="rate"
					label="Rate"
					expand
					:value="DEFAULT_RATE"
					min="1"
					max="5"
					hint="How good the learning content is, the higher score the better."
				></nord-range>

				<nord-button type="submit" expand disabled variant="primary">Create</nord-button>
			</nord-stack>
		</form>
	</nord-card>
</template>

<style scoped></style>
