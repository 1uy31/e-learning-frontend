<script setup lang="ts">
const props = defineProps<{ class: string }>();
const BASE_CLASS =
	"flex flex-row items-end justify-between rounded bg-cyan-700 py-1 pl-2.5 pr-2 text-xs leading-normal text-cyan-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-cyan-900 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-cyan-900 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-cyan-900 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] ";
const combinedClass = BASE_CLASS + (props.class || "");
</script>

<template>
	<button type="button" :class="combinedClass" data-te-ripple-init data-te-ripple-color="light">
		<slot name="icon"></slot>
	</button>
</template>

<style scoped></style>
