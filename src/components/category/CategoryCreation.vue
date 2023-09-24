<script setup lang="ts">
import { useCategoryStore } from "@stores/category";
import { onMounted } from "vue";
import { Input, Ripple, initTE } from "tw-elements";
import SmallSpinner from "@components/share/SmallSpinner.vue";
import { useState } from "@src/composable/useState";
import { MEDIUM_TIMING } from "@src/constants/timing";
import {
	FORM_BUTTON_CLASS,
	FORM_INPUT_CLASS,
	FORM_INPUT_LABEL_CLASS,
	MEDIUM_CONTAINER_CLASS,
	REQUIRED_MARK_CLASS,
} from "@src/constants/classes";
import { ERROR_INFO, SUCCESS_INFO } from "@src/constants";
import { useForm, useResetForm } from "vee-validate";
import * as zod from "zod";
import { toTypedSchema } from "@vee-validate/zod";

const categoryStore = useCategoryStore();
const {
	errors: formErrors,
	values: formValues,
	defineInputBinds,
} = useForm({
	validationSchema: toTypedSchema(
		zod.object({
			categoryField: zod.string().nonempty().max(256),
		})
	),
});
const resetForm = useResetForm();

const [formMessage, setFormMessage] = useState({ message: "", class: "" });
const [isCreatingCategory, toggleIsCreatingCategory] = useState(false);

const categoryField = defineInputBinds("categoryField");

const successfulCreationCallback = () => {
	resetForm();
	setFormMessage({ message: "New category created successfully.", ...SUCCESS_INFO });
	setTimeout(() => setFormMessage({ message: "", class: "" }), MEDIUM_TIMING);
};

const submitNewCategory = async (event: SubmitEvent) => {
	event.preventDefault();
	if (Object.keys(formErrors.value).length > 0 || !formValues.categoryField) {
		return;
	}
	toggleIsCreatingCategory(true);
	await categoryStore.addCategory(
		successfulCreationCallback,
		(error: Error) => setFormMessage({ message: error.message, ...ERROR_INFO }),
		formValues.categoryField
	);
	toggleIsCreatingCategory(false);
};

onMounted(() => {
	initTE({ Input, Ripple });
});
</script>

<template>
	<div :class="MEDIUM_CONTAINER_CLASS">
		<form id="id_new_category_form" @submit.prevent="submitNewCategory">
			<p v-if="formMessage.message" :class="'text-l mb-5 ' + formMessage.class" aria-live="assertive">
				{{ formMessage.message }}
			</p>
			<div class="relative mb-5 mt-2" data-te-input-wrapper-init>
				<input
					id="id_category_field"
					type="text"
					v-bind="categoryField"
					required
					aria-required
					aria-describedby="id_category_field_error"
					:aria-invalid="formErrors.categoryField ? true : null"
					:class="FORM_INPUT_CLASS"
					placeholder="Unique category name"
				/>
				<label for="id_category_field" :class="FORM_INPUT_LABEL_CLASS"
					><span :class="REQUIRED_MARK_CLASS">*</span> Category name
				</label>
			</div>
			<p v-if="formErrors.categoryField" id="id_category_field_error" :class="'text-l mb-5 ' + ERROR_INFO.class">
				{{ formErrors.categoryField }}
			</p>

			<button
				type="submit"
				:class="FORM_BUTTON_CLASS"
				data-te-ripple-init
				data-te-ripple-color="light"
				:aria-disabled="!formValues.categoryField"
			>
				<SmallSpinner v-if="isCreatingCategory" status="Creating" />
				{{ !isCreatingCategory ? "Create" : "" }}
			</button>
		</form>
	</div>
</template>

<style scoped></style>
