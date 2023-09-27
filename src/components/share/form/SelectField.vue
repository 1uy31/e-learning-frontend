<script setup lang="ts">
import { onMounted } from "vue";
import { initTE, Select } from "tw-elements";
import { FORM_SELECTION_CLASS, REQUIRED_MARK_CLASS } from "@src/constants/classes";
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
	<SmallSpinner v-if="loadingOptions" class="border-cyan-700" status="Loading options" />
	<!-- UI looks buggy when v-else is used. -->
	<div
		:class="'mb-5 mt-2 flex flex-row items-center justify-between ' + FORM_SELECTION_CLASS"
		:style="[loadingOptions ? { display: 'none' } : {}]"
	>
		<label :for="id" class="mr-2"><span v-if="required" :class="REQUIRED_MARK_CLASS">*</span> {{ label }}</label>
		<div class="w-3/4">
			<select
				v-bind="$attrs"
				:id="id"
				:required="Boolean(required)"
				:aria-required="Boolean(required)"
				:aria-describedby="`${id}_error`"
				:aria-invalid="error ? true : null"
				data-te-select-init
			>
				<option v-if="!required" />
				<slot name="options"></slot>
			</select>
		</div>
		<!--		<label :for="id" :class="FORM_INPUT_LABEL_CLASS" data-te-select-label-ref-->
		<!--			><span v-if="required" :class="REQUIRED_MARK_CLASS">*</span> {{ label }}</label-->
		<!--		>-->
	</div>
	<p v-if="error" :id="`${id}_error`" :class="'text-l -mt-4 mb-5 ' + ERROR_INFO.class">
		{{ error }}
	</p>
</template>

<style scoped></style>
