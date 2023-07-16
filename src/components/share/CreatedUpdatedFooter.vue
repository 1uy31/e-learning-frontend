<script setup lang="ts">
import { Category, Diary } from "@appTypes/dataModels";

defineProps<{ displayObject: Category | Diary }>();
</script>

<template>
	<div slot="footer">
		<p>Created at: {{ displayObject.createdAt }}</p>
		<p v-if="displayObject.updatedAt">Updated at: {{ displayObject.updatedAt }}</p>
	</div>
</template>

<style scoped></style>
