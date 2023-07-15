<script setup lang="ts">
const props = defineProps(["rate"]);
const rating = Math.min(props.rate || 0, 5);
</script>

<template>
	<div style="display: flex; flex-direction: row">
		<nord-icon v-for="index in rating" size="s" name="interface-star-filled" :key="index" />
		<nord-icon v-for="index in 5 - rating" size="s" name="interface-star" :key="index + 5" />
	</div>
</template>

<style scoped></style>
