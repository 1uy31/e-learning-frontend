<script setup lang="ts">
const BASE_CLASS =
	"inline-block h-6 w-6 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite] ";
const SPINNERS_CLASS = [
	"text-cyan-800 mr-1",
	"text-cyan-700 mr-1",
	"text-cyan-600 mr-1",
	"text-cyan-500 mr-1",
	"text-cyan-400 mr-1",
	"text-cyan-300 mr-1",
	"text-cyan-200",
];
</script>

<template>
	<div class="m-auto my-2 w-fit">
		<div
			v-for="spinnerClass in SPINNERS_CLASS"
			:key="spinnerClass"
			:class="BASE_CLASS + spinnerClass"
			role="status"
		>
			<span
				class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
				>Loading...</span
			>
		</div>
	</div>
</template>

<style scoped></style>
