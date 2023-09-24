<script setup lang="ts">
import { onMounted } from "vue";
import { initTE, Input } from "tw-elements";
import { ERROR_INFO } from "@src/constants";
import { FORM_INPUT_CLASS, FORM_INPUT_LABEL_CLASS, REQUIRED_MARK_CLASS } from "@src/constants/classes";

defineProps<{ id: string; label: string; required?: boolean; error?: string }>();

onMounted(() => {
	initTE({ Input });
});
</script>

<template>
	<div class="relative mb-5 mt-2" data-te-input-wrapper-init>
		<input
			v-bind="$attrs"
			:id="id"
			:required="Boolean(required)"
			:aria-required="Boolean(required)"
			:aria-describedby="`${id}_error`"
			:aria-invalid="error ? true : null"
			:class="FORM_INPUT_CLASS"
		/>
		<label :for="id" :class="FORM_INPUT_LABEL_CLASS"
			><span v-if="required" :class="REQUIRED_MARK_CLASS">*</span> {{ label }}
		</label>
	</div>
	<p v-if="error" :id="`${id}_error`" :class="'text-l -mt-2 mb-5 ' + ERROR_INFO.class">
		{{ error }}
	</p>
</template>

<style scoped></style>
