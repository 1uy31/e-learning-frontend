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

const categoryStore = useCategoryStore();

const [formMessage, setFormMessage] = useState({ message: "", class: "" });
const [categoryName, setCategoryName] = useState("");
const [isCreatingCategory, toggleIsCreatingCategory] = useState(false);

const successfulCreationCallback = () => {
	setCategoryName("");
	setFormMessage({ message: "New category created successfully.", ...SUCCESS_INFO });
	setTimeout(() => setFormMessage({ message: "", class: "" }), MEDIUM_TIMING);
};

const submitNewCategory = async () => {
	if (["", undefined].includes(categoryName.value) || isCreatingCategory.value) {
		return;
	}
	toggleIsCreatingCategory(true);
	await categoryStore.addCategory(
		successfulCreationCallback,
		(error: Error) => setFormMessage({ message: error.message, ERROR_INFO }),
		categoryName.value
	);
	toggleIsCreatingCategory(false);
};

onMounted(() => {
	initTE({ Input, Ripple });
});
</script>

<template>
	<div :class="MEDIUM_CONTAINER_CLASS">
		<form>
			<p v-if="formMessage.message" :class="'text-l mb-5 ' + formMessage.class">{{ formMessage.message }}</p>
			<div class="relative mb-5 mt-2" data-te-input-wrapper-init>
				<input
					id="id_new_category_name"
					type="text"
					:class="FORM_INPUT_CLASS"
					placeholder="A unique name"
					:value="categoryName"
					@change="(event) => setCategoryName(event.target.value)"
				/>
				<label for="id_new_category_name" :class="FORM_INPUT_LABEL_CLASS"
					><span :class="REQUIRED_MARK_CLASS">*</span> Category name
				</label>
			</div>

			<button
				type="button"
				:class="FORM_BUTTON_CLASS"
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
