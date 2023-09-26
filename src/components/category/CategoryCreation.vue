<script setup lang="ts">
import { useCategoryStore } from "@stores/category";
import { useState } from "@src/composable/useState";
import { MEDIUM_TIMING } from "@src/constants/timing";
import { MEDIUM_CONTAINER_CLASS } from "@src/constants/classes";
import { ERROR_INFO, SUCCESS_INFO } from "@src/constants";
import { useField, useForm, useResetForm, useIsFormValid, useIsFormDirty } from "vee-validate";
import * as zod from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import InputField from "@components/share/form/InputField.vue";
import FormButton from "@components/share/form/FormButton.vue";
import FormMessage from "@components/share/form/FormMessage.vue";

const categoryStore = useCategoryStore();
useForm({
	validationSchema: toTypedSchema(
		zod.object({
			categoryField: zod.string().nonempty(),
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
} = useField<string>("categoryField");

const [formMessage, setFormMessage] = useState({ message: "", class: "" });
const [isCreatingCategory, toggleIsCreatingCategory] = useState(false);

const successfulCreationCallback = () => {
	resetForm();
	setFormMessage({ message: "New category created successfully.", ...SUCCESS_INFO });
	setTimeout(() => setFormMessage({ message: "", class: "" }), MEDIUM_TIMING);
};

const submitNewCategory = async () => {
	if (!isFormValid.value || !isFormDirty.value) {
		return;
	}
	toggleIsCreatingCategory(true);
	await categoryStore.addCategory(
		successfulCreationCallback,
		(error: Error) => setFormMessage({ message: error.message, ...ERROR_INFO }),
		categoryValue.value
	);
	toggleIsCreatingCategory(false);
};
</script>

<template>
	<div :class="MEDIUM_CONTAINER_CLASS">
		<form @submit.prevent="submitNewCategory">
			<FormMessage :message="formMessage.message" :message-class="formMessage.class" />
			<InputField
				id="id_new_category_field_category"
				type="text"
				label="Category name"
				required
				:value="categoryValue"
				:error="categoryError"
				placeholder="Unique category name"
				@change="handleCategoryChange"
			/>
			<FormButton
				:aria-disabled="!categoryValue"
				label="Create"
				:status="isCreatingCategory"
				status-label="Creating"
			/>
		</form>
	</div>
</template>

<style scoped></style>
