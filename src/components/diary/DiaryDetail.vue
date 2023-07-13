<script setup lang="ts">
import { useDiaryStore } from "@stores/diary";
import { onBeforeMount, onMounted } from "vue";
import { storeToRefs } from "pinia";

const diaryStore = useDiaryStore();
const { selectedDiary } = storeToRefs(diaryStore);

let starIcons = [];

// onBeforeMount(() => {});
</script>

<template>
	<nord-card padding="m">
		<div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between">
			<h2 slot="header">{{ selectedDiary.topic }}</h2>
			<div style="display: flex; flex-direction: row">
				<nord-icon
					v-for="index in selectedDiary.rate || 0"
					size="s"
					name="interface-star-filled"
					:key="index"
				/>
				<nord-icon
					v-for="index in 5 - (selectedDiary.rate || 0)"
					size="s"
					name="interface-star"
					:key="index + 10"
				/>
			</div>
		</div>

		<div
			style="
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				margin-bottom: var(--n-space-s);
			"
		>
			<div>
				<nord-button href="#" size="s" variant="primary" style="margin-right: var(--n-space-s)">
					<nord-icon slot="start" name="file-notes"></nord-icon>
					New note
				</nord-button>

				<nord-button href="#" size="s" variant="default" style="margin-right: var(--n-space-s)">
					<nord-icon slot="start" name="interface-add-small"></nord-icon>
					Review count
				</nord-button>

				<nord-button href="#" size="s" variant="default">
					<nord-icon slot="start" name="interface-edit-2"></nord-icon>
					Edit
				</nord-button>
			</div>

			<div>
				<nord-badge variant="highlight" style="margin-right: var(--n-space-s)"
					><a :href="selectedDiary.sourceUrl">Source</a></nord-badge
				>
				<nord-badge variant="highlight">Review times: {{ selectedDiary.reviewCount }}</nord-badge>
			</div>
		</div>

		<nord-divider />

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
