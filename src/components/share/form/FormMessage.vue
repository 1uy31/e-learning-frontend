<script setup lang="ts">
defineProps<{ message: string; messageClass: string }>();
</script>

<template>
	<p v-if="message" :class="`text-l mb-5 ${messageClass}`" aria-live="assertive">
		{{ message }}
	</p>
</template>

<style scoped></style>
