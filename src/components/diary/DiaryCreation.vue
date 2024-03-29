<script setup lang="ts">
import { useCategoryStore } from "@stores/category";
import { useDiaryStore } from "@stores/diary";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { MEDIUM_TIMING, QUICK_TIMING } from "@src/constants/timing";
import { Diary, DiaryInput } from "@appTypes/dataModels";
import { alertIfNullUndefined, presetSelectionField } from "@src/utils";
import { useState } from "@src/composable/hooks";
import { MEDIUM_CONTAINER_CLASS } from "@src/constants/classes";
import { SUCCESS_INFO, ERROR_INFO } from "@src/constants";
import { useField, useForm, useIsFormDirty, useIsFormValid, useResetForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import InputField from "@components/share/form/InputField.vue";
import RangeField from "@components/share/form/RangeField.vue";
import FormButton from "@components/share/form/FormButton.vue";
import FormMessage from "@components/share/form/FormMessage.vue";
import SelectField from "@components/share/form/SelectField.vue";

const DEFAULT_RATE = 3;
const CATEGORY_SELECTION_ELEMENT = "Category selection in diary creation form";

const categoryStore = useCategoryStore();
const diaryStore = useDiaryStore();
const { categories, selectedCategory } = storeToRefs(categoryStore);
const { diariesByCategory, loadingDiaries, selectedDiary } = storeToRefs(diaryStore);

const { values: formValues } = useForm<DiaryInput>({
	initialValues: {
		categoryId: selectedCategory?.value?.id,
		parentDiaryId: selectedDiary?.value?.id,
		rate: DEFAULT_RATE,
	},
	validationSchema: toTypedSchema(
		zod.object({
			categoryId: zod.number(),
			parentDiaryId: zod.number().optional(),
			topic: zod.string().max(1024),
			sourceUrl: zod.string().max(256).optional(),
			rate: zod.number().min(1).max(5),
		})
	),
});
const resetForm = useResetForm();
const isFormValid = useIsFormValid();
const isFormDirty = useIsFormDirty();

const {
	value: categoryValue,
	errorMessage: categoryError,
	handleChange: handleCategoryChange,
	setValue: setCategoryValue,
} = useField("categoryId");
const {
	value: parentDiaryValue,
	errorMessage: parentDiaryError,
	handleChange: handleParentDiaryChange,
} = useField("parentDiaryId");
const { value: topicValue, errorMessage: topicError, handleChange: handleTopicChange } = useField("topic");
const {
	value: sourceUrlValue,
	errorMessage: sourceUrlError,
	handleChange: handleSourceUrlChange,
} = useField("sourceUrl");
const { value: rateValue, errorMessage: rateError, handleChange: handleRateChange } = useField("rate");

const [formMessage, setFormMessage] = useState({ message: "", class: "" });
const [parentDiaries, setParentDiaries] = useState<Array<Diary>>([]);
const [isCreatingDiary, toggleIsCreatingDiary] = useState(false);

const successfulCreationCallback = () => {
	resetForm();
	setFormMessage({ message: "New diary created successfully.", ...SUCCESS_INFO });

	setTimeout(() => {
		setFormMessage({ message: "", class: "" });
	}, MEDIUM_TIMING);
};

const submitDiaryCreationForm = async () => {
	alertIfNullUndefined(categories.value[0]?.id, "", "Please create a category first.");

	if (!isFormValid.value || !isFormDirty.value) {
		return;
	}
	toggleIsCreatingDiary(true);
	await diaryStore.addDiary(
		successfulCreationCallback,
		(error: Error) => setFormMessage({ message: error.message, ...ERROR_INFO }),
		{
			...formValues,
			categoryId: formValues.categoryId,
			parentDiaryId: formValues.parentDiaryId,
		}
	);
	toggleIsCreatingDiary(false);
};

const setParentDiaryOptions = async (categoryId?: number) => {
	if (!categoryId) {
		setParentDiaries([]);
		return;
	}

	!Object.keys(diariesByCategory.value).includes(categoryId.toString()) &&
		(await diaryStore.getDiariesByCategory(categoryId));

	setParentDiaries(diariesByCategory.value[categoryId].filter((diary) => !diary.parentDiaryId));
};

onMounted(() => {
	const categorySelection = alertIfNullUndefined(
		document.getElementById("id_new_diary_field_category"),
		CATEGORY_SELECTION_ELEMENT
	);

	categorySelection.addEventListener("change", async (event) => {
		// It is safe to cast the target's type according to how the field is declared.
		const eventTarget = event?.target as HTMLSelectElement | undefined;
		const selectedCategoryId = eventTarget?.value ? Number(eventTarget?.value) : undefined;
		await setParentDiaryOptions(selectedCategoryId);
		presetSelectionField("id_new_diary_field_parent_diary", selectedDiary?.value?.id);
	});

	setTimeout(async () => {
		const defaultCategoryId = categories.value[0].id;
		if (defaultCategoryId) {
			setCategoryValue(defaultCategoryId);
			await setParentDiaryOptions(defaultCategoryId);
		}
	}, QUICK_TIMING);
});
</script>

<template>
	<div :class="MEDIUM_CONTAINER_CLASS">
		<form id="id_new_diary_form" @submit.prevent="submitDiaryCreationForm">
			<FormMessage :message="formMessage.message" :message-class="formMessage.class" />

			<SelectField
				id="id_new_diary_field_category"
				name="categoryId"
				label="Category"
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
				name="parentDiaryId"
				label="Parent diary"
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
				name="topic"
				type="text"
				label="Topic"
				required
				:value="topicValue"
				:error="topicError"
				placeholder="Learning topic"
				@change="handleTopicChange"
			/>

			<InputField
				id="id_new_diary_field_source_url"
				name="sourceUrl"
				type="text"
				label="Source URL"
				:value="sourceUrlValue"
				:error="sourceUrlError"
				placeholder="Learning source url"
				@change="handleSourceUrlChange"
			/>

			<RangeField
				id="id_new_diary_field_rate"
				name="rate"
				label="Rate"
				min="1"
				max="5"
				step="1"
				:value="rateValue"
				:error="rateError"
				:display-value="`${Number(rateValue || DEFAULT_RATE)}/5`"
				@change="handleRateChange"
			/>

			<FormButton
				:aria-disabled="!categoryValue || !topicValue"
				label="Create"
				:status="isCreatingDiary"
				status-label="Creating"
			/>
		</form>
	</div>
</template>

<style scoped></style>
