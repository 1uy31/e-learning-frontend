<script setup lang="ts">
import { useCategoryStore } from "@stores/category";
import { useDiaryStore } from "@stores/diary";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { VERY_QUICK_TIMING, MEDIUM_TIMING } from "@src/constants/timing";
import { Diary } from "@appTypes/dataModels";
import { alertIfNullUndefined } from "@src/utils";
import { useState } from "@src/composable/useState";
import { MEDIUM_CONTAINER_CLASS } from "@src/constants/classes";
import { SUCCESS_INFO, ERROR_INFO } from "@src/constants";
import { useField, useForm, useResetForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import InputField from "@components/share/InputField.vue";
import RangeField from "@components/share/RangeField.vue";
import FormButton from "@components/share/FormButton.vue";
import FormMessage from "@components/share/FormMessage.vue";
import SelectField from "@components/share/SelectField.vue";

const DEFAULT_RATE = 3;

const categoryStore = useCategoryStore();
const diaryStore = useDiaryStore();
const { categories, selectedCategory } = storeToRefs(categoryStore);
const { diariesByCategory, loadingDiaries, selectedDiary } = storeToRefs(diaryStore);

const { values: formValues } = useForm({
	initialValues: {
		categoryField: selectedCategory?.value?.id,
		parentDiaryField: selectedDiary?.value?.id,
		rateField: DEFAULT_RATE,
	},
	validationSchema: toTypedSchema(
		zod.object({
			categoryField: zod.number(),
			parentDiaryField: zod.number().optional(),
			topicField: zod.string().max(1024),
			sourceUrlField: zod.string().max(256).optional(),
			rateField: zod.number().min(1).max(5),
		})
	),
});
const resetForm = useResetForm();

const {
	value: categoryValue,
	errorMessage: categoryError,
	handleChange: handleCategoryChange,
} = useField("categoryField");
const {
	value: parentDiaryValue,
	errorMessage: parentDiaryError,
	handleChange: handleParentDiaryChange,
} = useField("parentDiaryField");
const { value: topicValue, errorMessage: topicError, handleChange: handleTopicChange } = useField("topicField");
const {
	value: sourceUrlValue,
	errorMessage: sourceUrlError,
	handleChange: handleSourceUrlChange,
} = useField("sourceUrlField");
const { value: rateValue, errorMessage: rateError, handleChange: handleRateChange } = useField("rateField");

const [formMessage, setFormMessage] = useState({ message: "", class: "" });
const [parentDiaries, setParentDiaries] = useState<Array<Diary>>([]);
const [isCreatingDiary, toggleIsCreatingDiary] = useState(false);

const submitDiaryCreationForm = async () => {
	const form = alertIfNullUndefined(document.getElementById("id_new_diary_form"), "New diary form");

	const successfulCreationCallback = () => {
		resetForm();
		setFormMessage({ message: "New diary created successfully.", ...SUCCESS_INFO });

		// To load the new option for field parent diary.
		const categorySelection = alertIfNullUndefined(
			document.getElementById("id_new_diary_field_category"),
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
	const categorySelection = alertIfNullUndefined(
		document.getElementById("id_new_diary_field_category"),
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
		<form id="id_new_diary_form" @submit.prevent="submitDiaryCreationForm">
			<FormMessage :message="formMessage.message" :message-class="formMessage.class" />

			<SelectField
				id="id_new_diary_field_category"
				label="Category"
				name="categoryId"
				form="id_new_diary_form"
				required
				:value="categoryValue"
				:error="categoryError"
				@change="handleCategoryChange"
			>
				<template #options>
					<option v-for="category in categories" :key="category.id" :value="category.id">
						{{ category.name }}
					</option>
				</template>
			</SelectField>

			<SelectField
				id="id_new_diary_field_parent_diary"
				label="Parent diary"
				name="parentDiaryId"
				form="id_new_diary_form"
				:value="parentDiaryValue"
				:error="parentDiaryError"
				:loading-options="loadingDiaries"
				@change="handleParentDiaryChange"
			>
				<template #options>
					<option v-for="parentDiary in parentDiaries" :key="parentDiary.id" :value="parentDiary.id">
						{{ parentDiary.topic }}
					</option>
				</template>
			</SelectField>

			<InputField
				id="id_new_diary_field_topic"
				type="text"
				label="Topic"
				required
				name="topic"
				form="id_new_diary_form"
				:value="topicValue"
				:error="topicError"
				placeholder="Learning topic"
				@change="handleTopicChange"
			/>

			<InputField
				id="id_new_diary_field_source_url"
				type="text"
				label="Source URL"
				name="sourceUrl"
				form="id_new_diary_form"
				:value="sourceUrlValue"
				:error="sourceUrlError"
				placeholder="Learning source url"
				@change="handleSourceUrlChange"
			/>

			<RangeField
				id="id_new_diary_field_rate"
				label="Rate"
				name="rate"
				form="id_new_diary_form"
				min="1"
				max="5"
				step="1"
				:value="rateValue"
				:error="rateError"
				:display-value="`${Number(rateValue || DEFAULT_RATE)}/5`"
				@change="handleRateChange"
			/>

			<FormButton
				:aria-disabled="!formValues.topicField"
				label="Create"
				:status="isCreatingDiary"
				status-label="Creating"
			/>
		</form>
	</div>
</template>

<style scoped></style>
