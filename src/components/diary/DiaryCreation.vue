<!--<script setup lang="ts">-->
<!--import { useCategoryStore } from "@stores/category";-->
<!--import { useDiaryStore } from "@stores/diary";-->
<!--import { onMounted, ref } from "vue";-->
<!--import { storeToRefs } from "pinia";-->
<!--import { MEDIUM_TIMING, VERY_QUICK_TIMING } from "@src/constants/timing";-->
<!--import { Diary } from "@appTypes/dataModels";-->
<!--import { alertIfNullUndefined } from "@src/utils";-->

<!--const categoryStore = useCategoryStore();-->
<!--const diaryStore = useDiaryStore();-->
<!--const { categories } = storeToRefs(categoryStore);-->
<!--const { diariesByCategory, loadingDiaries } = storeToRefs(diaryStore);-->

<!--const DEFAULT_RATE = "3";-->

<!--const parentDiaries = ref<Array<Diary>>([]);-->
<!--const parentDiaryRefs = ref([]);-->
<!--const submitDiaryCreationForm = async (event: SubmitEvent) => {-->
<!--	const form = alertIfNullUndefined(-->
<!--		<HTMLFormElement>document.getElementById("id_diary_creation_form"),-->
<!--		"Diary creation form"-->
<!--	);-->
<!--	const formBanner = alertIfNullUndefined(form.querySelector("nord-banner"), "Diary creation form banner");-->
<!--	const submitButton = alertIfNullUndefined(form.querySelector("nord-button"), "Diary creation form submit button");-->

<!--	if (submitButton.loading) {-->
<!--		return;-->
<!--	}-->

<!--	const successfulCreationCallback = () => {-->
<!--		formBanner.variant = "success";-->
<!--		formBanner.innerHTML = "Diary created successfully.";-->
<!--		formBanner.style.display = "block";-->

<!--		const categorySelection = form.querySelectorAll("nord-select")[0];-->
<!--		const parentDiarySelection = form.querySelectorAll("nord-select")[1];-->
<!--		categorySelection.value = categories.value.length > 0 ? `${categories.value[0].id}` : "";-->
<!--		parentDiarySelection.value = "";-->

<!--		const textInputs = form.querySelectorAll("nord-input");-->
<!--		textInputs.forEach((textInput) => (textInput.value = ""));-->
<!--		const rate = form.querySelectorAll("nord-range")[0];-->
<!--		rate.value = DEFAULT_RATE;-->

<!--		setTimeout(() => {-->
<!--			formBanner.style.display = "none";-->
<!--		}, MEDIUM_TIMING);-->
<!--	};-->

<!--	const failedCreationCallback = (error: Error) => {-->
<!--		formBanner.variant = "danger";-->
<!--		formBanner.innerHTML = error.message;-->
<!--		formBanner.style.display = "block";-->
<!--	};-->

<!--	const formInput = new FormData(<HTMLFormElement>event.target);-->
<!--	const entries = [...formInput.entries()].reduce(-->
<!--		(object, entry) => Object.assign(object, { [entry[0]]: entry[1] }),-->
<!--		{}-->
<!--	);-->

<!--	if (!Object.keys(entries).includes("categoryId")) {-->
<!--		entries["categoryId"] = categories.value[0]?.id;-->
<!--	}-->

<!--	submitButton.loading = true;-->
<!--	await diaryStore.addDiary(successfulCreationCallback, failedCreationCallback, {-->
<!--		...entries,-->
<!--		categoryId: entries.categoryId ? Number(entries.categoryId) : undefined,-->
<!--		parentDiaryId: entries.parentDiaryId ? Number(entries.parentDiaryId) : undefined,-->
<!--		rate: Number(entries.rate),-->
<!--	});-->
<!--	submitButton.loading = false;-->
<!--};-->

<!--const setParentDiaryOptions = async (categoryId?: string) => {-->
<!--	if (!categoryId) {-->
<!--		parentDiaries.value = [];-->
<!--		return;-->
<!--	}-->
<!--	const categoryIdNumber = Number(categoryId);-->
<!--	if (Object.keys(diariesByCategory).includes(categoryId)) {-->
<!--		parentDiaries.value = diariesByCategory.value[categoryIdNumber];-->
<!--		return;-->
<!--	}-->
<!--	await diaryStore.getDiariesByCategory(categoryIdNumber);-->
<!--	parentDiaries.value = diariesByCategory.value[categoryIdNumber];-->
<!--};-->

<!--onMounted(() => {-->
<!--	const form = alertIfNullUndefined(document.getElementById("id_diary_creation_form"), "Diary creation form");-->
<!--	const formBanner = alertIfNullUndefined(form.querySelector("nord-banner"), "Diary creation form banner");-->
<!--	const categorySelection = alertIfNullUndefined(-->
<!--		form.querySelectorAll("nord-select")[0],-->
<!--		"Category selection in diary creation form"-->
<!--	);-->
<!--	const topicInput = alertIfNullUndefined(-->
<!--		form.querySelectorAll("nord-input")[0],-->
<!--		"Topic input in diary creation form"-->
<!--	);-->
<!--	const submitButton = alertIfNullUndefined(form.querySelector("nord-button"), "Diary creation form submit button");-->

<!--	categorySelection.addEventListener("change", async (event) => {-->
<!--		const selectedCategoryId = (<HTMLInputElement | null>event.target)?.value;-->
<!--		await setParentDiaryOptions(selectedCategoryId);-->
<!--	});-->

<!--	topicInput.addEventListener("change", (event) => {-->
<!--		if ((<HTMLInputElement | null>event.target)?.value) {-->
<!--			submitButton.disabled = false;-->
<!--		} else {-->
<!--			submitButton.disabled = true;-->
<!--		}-->
<!--	});-->

<!--	setTimeout(async () => {-->
<!--		const defaultCategoryId = categories.value.length > 0 ? `${categories.value[0].id}` : undefined;-->
<!--		await setParentDiaryOptions(defaultCategoryId);-->
<!--	}, VERY_QUICK_TIMING);-->
<!--});-->
<!--</script>-->

<!--<template>-->
<!--	<nord-card padding="l">-->
<!--		<h1 slot="header">New diary</h1>-->
<!--		<form id="id_diary_creation_form" @submit.prevent="submitDiaryCreationForm">-->
<!--			<nord-stack>-->
<!--				<nord-banner shadow style="display: none"></nord-banner>-->
<!--				<nord-select name="categoryId" label="Category" expand>-->
<!--					<option v-for="category in categories" :key="category.id" :value="category.id">-->
<!--						{{ category.name }}-->
<!--					</option>-->
<!--				</nord-select>-->

<!--				<nord-progress-bar v-if="loadingDiaries" style="margin-top: var(&#45;&#45;n-space-s)"></nord-progress-bar>-->
<!--				<nord-select v-else name="parentDiaryId" label="Parent diary" expand>-->
<!--					<option key="-1" value="" />-->
<!--					<option-->
<!--						ref="parentDiaryRefs"-->
<!--						v-for="parentDiary in parentDiaries"-->
<!--						:key="parentDiary?.id"-->
<!--						:value="parentDiary?.id"-->
<!--					>-->
<!--						{{ parentDiary?.topic }}-->
<!--					</option>-->
<!--				</nord-select>-->
<!--				<nord-input-->
<!--					name="topic"-->
<!--					label="Topic"-->
<!--					expand-->
<!--					required-->
<!--					type="text"-->
<!--					maxlength="2"-->
<!--					placeholder="Learning topic"-->
<!--				></nord-input>-->

<!--				<nord-input-->
<!--					name="sourceUrl"-->
<!--					label="Source url"-->
<!--					expand-->
<!--					type="url"-->
<!--					placeholder="https://www.wikipedia.org/"-->
<!--				>-->
<!--				</nord-input>-->

<!--				<nord-range-->
<!--					name="rate"-->
<!--					label="Rate"-->
<!--					expand-->
<!--					:value="DEFAULT_RATE"-->
<!--					min="1"-->
<!--					max="5"-->
<!--					hint="How good the learning content is, the higher score the better."-->
<!--				></nord-range>-->

<!--				<nord-button type="submit" expand disabled variant="primary">Create</nord-button>-->
<!--			</nord-stack>-->
<!--		</form>-->
<!--	</nord-card>-->
<!--</template>-->

<!--<style scoped></style>-->
