<script setup lang="ts">
import { useDiaryStore } from "@stores/diary";
import { storeToRefs } from "pinia";
import CreatedUpdatedFooter from "@components/share/CreatedUpdatedFooter.vue";
import RateDisplay from "@components/share/RateDisplay.vue";

const diaryStore = useDiaryStore();
const { selectedDiary, childDiariesByDiary } = storeToRefs(diaryStore);
</script>

<template>
	<nord-card padding="m">
		<div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between">
			<h2 slot="header">{{ selectedDiary.topic }}</h2>
			<RateDisplay :rate="selectedDiary.rate" />
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
			<nord-button href="#" size="s" variant="default">
				<nord-icon slot="start" name="interface-edit-2"></nord-icon>
				Edit
			</nord-button>

			<nord-badge v-if="selectedDiary.sourceUrl" variant="highlight">
				<a :href="selectedDiary.sourceUrl">Source</a>
			</nord-badge>
		</div>

		<nord-divider />

		<nord-card style="margin-top: var(--n-space-m)">
			<nord-dropdown-group heading="Chapters">
				<nord-dropdown-item
					v-for="childDiary in childDiariesByDiary[`${selectedDiary.id}`]"
					:key="childDiary.id"
					icon="file-notepad"
					:value="childDiary.id"
					style="font-size: var(--n-font-size-l)"
				>
					<nord-icon size="s" name="file-notepad" style="margin-right: var(--n-space-s)" />
					{{ childDiary.topic }}
				</nord-dropdown-item>
			</nord-dropdown-group>
		</nord-card>

		<CreatedUpdatedFooter :display-object="selectedDiary" />
	</nord-card>
</template>

<style scoped></style>
