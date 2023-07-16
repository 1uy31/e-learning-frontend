<script setup lang="ts">
const props = defineProps<{ rate: number }>();
const rating = Math.min(props.rate || 0, 5);
</script>

<template>
	<div style="display: flex; flex-direction: row">
		<nord-icon v-for="index in rating" :key="index" size="s" name="interface-star-filled" />
		<nord-icon v-for="index in 5 - rating" :key="index + 5" size="s" name="interface-star" />
	</div>
</template>

<style scoped></style>
