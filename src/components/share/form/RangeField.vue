<script setup lang="ts">
import { onMounted } from "vue";
import { initTE, Input } from "tw-elements";
import { ERROR_INFO } from "@src/constants";
import { REQUIRED_MARK_CLASS } from "@src/constants/classes";

defineProps<{ id: string; label: string; displayValue: string; required?: boolean; error?: string }>();

onMounted(() => {
	initTE({ Input });
});
</script>

<template>
	<div class="relative mb-5">
		<label :for="id" class="inline-block text-cyan-700"
			><span v-if="required" :class="REQUIRED_MARK_CLASS">*</span> {{ label }}
		</label>
		<div class="flex flex-row justify-between">
			<p class="text-cyan-950">{{ displayValue }}</p>
			<input
				v-bind="$attrs"
				:id="id"
				:required="Boolean(required)"
				:aria-required="Boolean(required)"
				:aria-describedby="`${id}_error`"
				:aria-invalid="error ? true : null"
				type="range"
				class="h-1.5 w-3/4 cursor-pointer appearance-none self-center rounded-lg border-transparent bg-stone-300 accent-cyan-950"
			/>
		</div>
	</div>
	<p v-if="error" :id="`${id}_error`" :class="'text-l -mt-2 mb-5 ' + ERROR_INFO.class">
		{{ error }}
	</p>
</template>

<style scoped></style>
