<script setup lang="ts">
import { useDiaryStore } from "@stores/diary";
import { storeToRefs } from "pinia";
import RateDisplay from "@components/share/RateDisplay.vue";
import NoteCreation from "@components/note/NoteCreation.vue";
import { alertIfNullUndefined } from "@src/utils";
import CreatedUpdatedFooter from "@components/share/CreatedUpdatedFooter.vue";

const diaryStore = useDiaryStore();
const { selectedDiary } = storeToRefs(diaryStore);

const openNoteCreationForm = () => {
	const modal = alertIfNullUndefined(document.getElementById("id_note_creation_modal"), "Note creation modal");
	modal.showModal();
};
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
			<div>
				<nord-button
					size="s"
					variant="primary"
					style="margin-right: var(--n-space-s)"
					@click="openNoteCreationForm"
				>
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
				<nord-badge v-if="selectedDiary.sourceUrl" variant="highlight" style="margin-right: var(--n-space-s)"
					><a :href="selectedDiary.sourceUrl">Source</a></nord-badge
				>
				<nord-badge variant="highlight">Review times: {{ selectedDiary.reviewCount }}</nord-badge>
			</div>
		</div>

		<nord-divider />

		<CreatedUpdatedFooter :display-object="selectedDiary" />
	</nord-card>
	<NoteCreation />
</template>

<style scoped></style>
