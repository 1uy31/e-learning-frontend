<script setup lang="ts">
import { useDiaryStore } from "@stores/diary";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

const diaryStore = useDiaryStore();
const { selectedDiary } = storeToRefs(diaryStore);

// onMounted(() => {});
</script>

<template>
	<nord-card padding="m">
		<div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between">
			<h2 slot="header">{{ selectedDiary.topic }}</h2>
			<div style="display: flex; flex-direction: row">
				<nord-icon size="s" name="interface-star-filled" />
				<nord-icon size="s" name="interface-star-filled" />
				<nord-icon size="s" name="interface-star-filled" />
				<nord-icon size="s" name="interface-star" />
				<nord-icon size="s" name="interface-star" />
			</div>
		</div>

		Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nulla provident aliquid corporis tempora eius quam,
		quae vel molestias esse maxime aperiam totam suscipit. Nobis consectetur optio reprehenderit animi? Suscipit,
		quibusdam?

		<div slot="footer">
			<p>Created at: {{ selectedDiary.createdAt }}</p>
			<p v-if="selectedDiary.updatedAt">Updated at: {{ selectedDiary.updatedAt }}</p>
		</div>
	</nord-card>
</template>

<style scoped></style>
