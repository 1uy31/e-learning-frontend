<script setup lang="ts">
defineProps(["displayObject"]);
</script>

<template>
	<div slot="footer">
		<p>Created at: {{ displayObject.createdAt }}</p>
		<p v-if="displayObject.updatedAt">Updated at: {{ displayObject.updatedAt }}</p>
	</div>
</template>

<style scoped></style>
