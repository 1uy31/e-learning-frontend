<script setup lang="ts">
import { useCategoryStore } from "@stores/category";
import { useDiaryStore } from "@stores/diary";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { VERY_QUICK_TIMING, MEDIUM_TIMING } from "@src/constants/timing";
import { Diary } from "@appTypes/dataModels";
import { alertIfNullUndefined } from "@src/utils";
import { initTE, Input, Ripple, Select } from "tw-elements";
import { useState } from "@src/composable/useState";
import SmallSpinner from "@components/share/SmallSpinner.vue";
import {
	FORM_BUTTON_CLASS,
	FORM_INPUT_CLASS,
	FORM_INPUT_LABEL_CLASS,
	FORM_SELECTION_CLASS,
	MEDIUM_CONTAINER_CLASS,
	REQUIRED_MARK_CLASS,
} from "@src/constants/classes";
import { SUCCESS_INFO, ERROR_INFO } from "@src/constants";

const DEFAULT_RATE = "3";

const categoryStore = useCategoryStore();
const diaryStore = useDiaryStore();
const { categories, selectedCategory } = storeToRefs(categoryStore);
const { diariesByCategory, loadingDiaries, selectedDiary } = storeToRefs(diaryStore);

const [formMessage, setFormMessage] = useState({ message: "", class: "" });
const [diaryTopic, setDiaryTopic] = useState("");
const [diaryRate, setDiaryRate] = useState(DEFAULT_RATE);
const [parentDiaries, setParentDiaries] = useState<Array<Diary>>([]);
const [isCreatingDiary, toggleIsCreatingDiary] = useState(false);

const submitDiaryCreationForm = async () => {
	const form = alertIfNullUndefined(document.getElementById("id_new_diary_form"), "New diary form");

	const successfulCreationCallback = () => {
		setFormMessage({ message: "New diary created successfully.", ...SUCCESS_INFO });
		setDiaryTopic("");
		setDiaryRate(DEFAULT_RATE);
		form.reset();

		// To load the new option for field parent diary.
		const categorySelection = alertIfNullUndefined(
			document.getElementById("id_new_diary_category"),
			"New diary's category field"
		);
		categorySelection.dispatchEvent(new Event("change"));

		setTimeout(() => {
			setFormMessage({ message: "", class: "" });
		}, MEDIUM_TIMING);
	};

	const formInput = new FormData(form as HTMLFormElement);
	const entries = [...formInput.entries()].reduce(
		(object, entry) => Object.assign(object, { [entry[0]]: entry[1] }),
		{}
	);

	if (!Object.keys(entries).includes("categoryId")) {
		entries["categoryId"] = categories.value[0]?.id;
	}

	toggleIsCreatingDiary(true);
	await diaryStore.addDiary(
		successfulCreationCallback,
		(error: Error) => setFormMessage({ message: error.message, ...ERROR_INFO }),
		{
			...entries,
			categoryId: entries.categoryId ? Number(entries.categoryId) : undefined,
			parentDiaryId: entries.parentDiaryId ? Number(entries.parentDiaryId) : undefined,
			rate: Number(entries.rate),
		}
	);
	toggleIsCreatingDiary(false);
};

const setParentDiaryOptions = async (categoryId?: string) => {
	if (!categoryId) {
		setParentDiaries([]);
		return;
	}
	const categoryIdNumber = Number(categoryId);
	if (Object.keys(diariesByCategory).includes(categoryId)) {
		setParentDiaries(diariesByCategory.value[categoryIdNumber]);
		return;
	}
	await diaryStore.getDiariesByCategory(categoryIdNumber);
	setParentDiaries(diariesByCategory.value[categoryIdNumber]);
};

onMounted(() => {
	initTE({ Input, Ripple, Select });
	const categorySelection = alertIfNullUndefined(
		document.getElementById("id_new_diary_category"),
		"Category selection in diary creation form"
	);

	categorySelection.addEventListener("change", async (event) => {
		const eventTarget = event?.target as HTMLInputElement | undefined;
		const selectedCategoryId = eventTarget?.value;
		await setParentDiaryOptions(selectedCategoryId);
	});

	setTimeout(async () => {
		const defaultCategoryId = categories.value.length > 0 ? `${categories.value[0].id}` : undefined;
		await setParentDiaryOptions(defaultCategoryId);
	}, VERY_QUICK_TIMING);
});
</script>

<template>
	<div :class="MEDIUM_CONTAINER_CLASS">
		<form id="id_new_diary_form">
			<p v-if="formMessage.message" :class="'text-l mb-5 ' + formMessage.class">{{ formMessage.message }}</p>
			<div :class="'mb-6 mt-2 ' + FORM_SELECTION_CLASS">
				<select id="id_new_diary_category" data-te-select-init name="categoryId" form="id_new_diary_form">
					<option
						v-for="category in categories"
						:key="category.id"
						:value="category.id"
						:selected="selectedCategory?.id === category.id"
					>
						{{ category.name }}
					</option>
				</select>
				<label data-te-select-label-ref>Category</label>
			</div>

			<SmallSpinner v-if="loadingDiaries" class="-mt-2 mb-4 border-cyan-700" status="Loading diary options" />
			<!-- UI looks buggy when v-else is used. -->
			<div :class="'mb-5 ' + FORM_SELECTION_CLASS" :style="[loadingDiaries ? { display: 'none' } : {}]">
				<select data-te-select-init name="parentDiaryId" form="id_new_diary_form">
					<option>No parent diary</option>
					<option
						v-for="parentDiary in parentDiaries"
						:key="parentDiary.id"
						:value="parentDiary.id"
						:selected="selectedDiary?.id === parentDiary.id && diaryStore.hasChildDiary(selectedDiary.id)"
					>
						{{ parentDiary.topic }}
					</option>
				</select>
				<label data-te-select-label-ref>Parent diary</label>
			</div>

			<div class="relative mb-5" data-te-input-wrapper-init>
				<input
					id="id_new_diary_topic"
					name="topic"
					form="id_new_diary_form"
					type="text"
					:class="FORM_INPUT_CLASS"
					placeholder="Learning topic"
					:value="diaryTopic"
					@change="(event) => setDiaryTopic(event.target.value)"
				/>
				<label for="id_new_diary_topic" :class="FORM_INPUT_LABEL_CLASS"
					><span :class="REQUIRED_MARK_CLASS">*</span> Topic
				</label>
			</div>

			<div class="relative mb-4" data-te-input-wrapper-init>
				<input
					id="id_new_diary_source_url"
					name="sourceUrl"
					form="id_new_diary_form"
					type="text"
					:class="FORM_INPUT_CLASS"
					placeholder="Learning source url"
				/>
				<label for="id_new_diary_source_url" :class="FORM_INPUT_LABEL_CLASS">Source url </label>
			</div>

			<div class="relative mb-4">
				<label for="id_new_diary_rate" class="inline-block text-cyan-700"
					>Rate<span class="ml-2 text-cyan-950">{{ Number(diaryRate || DEFAULT_RATE) }}/5</span></label
				>
				<input
					id="id_new_diary_rate"
					type="range"
					name="rate"
					form="id_new_diary_form"
					class="h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-stone-300 accent-cyan-950"
					min="1"
					max="5"
					step="1"
					:value="diaryRate"
					@change="(event) => setDiaryRate(event.target.value)"
				/>
			</div>

			<button
				form="id_new_diary_form"
				type="button"
				:class="FORM_BUTTON_CLASS"
				data-te-ripple-init
				data-te-ripple-color="light"
				:disabled="['', undefined].includes(diaryTopic)"
				@click.prevent="submitDiaryCreationForm"
			>
				<SmallSpinner v-if="isCreatingDiary" status="Creating" />
				{{ !isCreatingDiary ? "Create" : "" }}
			</button>
		</form>
	</div>
</template>

<style scoped></style>
