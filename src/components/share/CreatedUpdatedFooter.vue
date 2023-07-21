<script setup lang="ts">
import { Diary } from "@appTypes/dataModels";
import { displayDatetime } from "@src/utils";

defineProps<{ displayObject: Diary }>();
</script>

<template>
	<div slot="footer">
		<p>Created at: {{ displayDatetime(displayObject.createdAt) }}</p>
		<p v-if="displayObject.updatedAt">Updated at: {{ displayDatetime(displayObject.updatedAt) }}</p>
	</div>
</template>

<style scoped></style>
