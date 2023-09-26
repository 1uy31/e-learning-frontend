<script setup lang="ts">
import { onMounted } from "vue";
import { initTE, Select } from "tw-elements";
import { FORM_INPUT_LABEL_CLASS, FORM_SELECTION_CLASS, REQUIRED_MARK_CLASS } from "@src/constants/classes";
import { ERROR_INFO } from "@src/constants";
import SmallSpinner from "@components/share/SmallSpinner.vue";

defineProps<{
	id: string;
	label: string;
	required?: boolean;
	error?: string;
	loadingOptions?: boolean;
}>();

onMounted(() => {
	initTE({ Select });
});
</script>

<template>
	<SmallSpinner v-if="loadingOptions" class="-mt-2 mb-4 border-cyan-700" status="Loading options" />
	<!-- UI looks buggy when v-else is used. -->
	<div :class="'mb-6 mt-2 ' + FORM_SELECTION_CLASS" :style="[loadingOptions ? { display: 'none' } : {}]">
		<select
			v-bind="$attrs"
			:id="id"
			:required="Boolean(required)"
			:aria-required="Boolean(required)"
			:aria-describedby="`${id}_error`"
			:aria-invalid="error ? true : null"
			data-te-select-init
		>
			<option :v-if="!Boolean(required)"></option>
			<slot name="options"></slot>
		</select>
		<label :for="id" :class="FORM_INPUT_LABEL_CLASS" data-te-select-label-ref
			><span v-if="required" :class="REQUIRED_MARK_CLASS">*</span> {{ label }}</label
		>
	</div>
	<p v-if="error" :id="`${id}_error`" :class="'text-l -mt-2 mb-5 ' + ERROR_INFO.class">
		{{ error }}
	</p>
</template>

<style scoped></style>
