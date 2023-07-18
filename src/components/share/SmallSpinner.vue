<script setup lang="ts">
const props = defineProps<{
	classes?: string;
	status?: string;
}>();

const BASE_CLASSES =
	"m-auto h-5 w-5 animate-spin rounded-full border-4 border-solid border-r-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite] ";
const customizedClasses = props.classes || "";
</script>

<template>
	<div :class="BASE_CLASSES + customizedClasses" role="status">
		<span
			class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
			>{{ status || "Loading" }}</span
		>
	</div>
</template>

<style scoped></style>
