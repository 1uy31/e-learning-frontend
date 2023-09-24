<script setup lang="ts">
import { useCategoryStore } from "@stores/category";
import { onMounted } from "vue";
import { Ripple, initTE } from "tw-elements";
import SmallSpinner from "@components/share/SmallSpinner.vue";
import { useState } from "@src/composable/useState";
import { MEDIUM_TIMING } from "@src/constants/timing";
import { FORM_BUTTON_CLASS, MEDIUM_CONTAINER_CLASS } from "@src/constants/classes";
import { ERROR_INFO, SUCCESS_INFO } from "@src/constants";
import { useField, useForm, useResetForm, useIsFormValid, useIsFormDirty } from "vee-validate";
import * as zod from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import InputField from "@components/share/InputField.vue";

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

onMounted(() => {
	initTE({ Ripple });
});
</script>

<template>
	<div :class="MEDIUM_CONTAINER_CLASS">
		<form @submit.prevent="submitNewCategory">
			<p v-if="formMessage.message" :class="'text-l mb-5 ' + formMessage.class" aria-live="assertive">
				{{ formMessage.message }}
			</p>

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

			<button
				type="submit"
				:aria-disabled="!categoryValue"
				:class="FORM_BUTTON_CLASS"
				data-te-ripple-init
				data-te-ripple-color="light"
			>
				<SmallSpinner v-if="isCreatingCategory" status="Creating" />
				{{ !isCreatingCategory ? "Create" : "" }}
			</button>
		</form>
	</div>
</template>

<style scoped></style>
