<script setup lang="ts">
import { useDiaryStore } from "@stores/diary";
import { storeToRefs } from "pinia";
import RateDisplay from "@components/share/RateDisplay.vue";
import CreatedUpdatedFooter from "@components/share/CreatedUpdatedFooter.vue";
import IconButton from "@components/share/IconButton.vue";
import NewNoteIcon from "@assets/icons/heroicons/documentText.svg?component";
import ReviewCountIcon from "@assets/icons/heroicons/eye.svg?component";
import EditIcon from "@assets/icons/heroicons/pencilSquare.svg?component";
import SectionDivider from "@components/share/SectionDivider.vue";
import { presetNoteCreationFormFields, showTabById } from "@src/utils";
import { useNoteStore } from "@stores/note";
import { generateHTML } from "@tiptap/vue-3";
import { EXTENSIONS } from "@src/constants";
import {
	INFO_WRAPPER_CLASS,
	LARGE_CONTAINER_CLASS,
	HYPER_LINK_WRAPPER_CLASS,
	ROW_CENTER_BETWEEN_CLASS,
	IN_BODY_HYPER_LINK_WRAPPER_CLASS,
} from "@src/constants/classes";

const diaryStore = useDiaryStore();
const noteStore = useNoteStore();
const { selectedDiary } = storeToRefs(diaryStore);
const { notesByDiary } = storeToRefs(noteStore);

const showNoteCreationForm = () => {
	showTabById("id_main_tab_new_note");
	presetNoteCreationFormFields(notesByDiary.value || {}, selectedDiary?.value?.id);
};
</script>

<template>
	<div :class="LARGE_CONTAINER_CLASS">
		<div :class="ROW_CENTER_BETWEEN_CLASS">
			<h2 class="text-2xl">{{ selectedDiary.topic }}</h2>
			<RateDisplay :rate="selectedDiary.rate" />
		</div>

		<div :class="'my-2 ' + ROW_CENTER_BETWEEN_CLASS">
			<div class="flex flex-row items-center">
				<span v-if="selectedDiary.sourceUrl" :class="HYPER_LINK_WRAPPER_CLASS">
					<a :href="selectedDiary.sourceUrl" target="_blank">Source</a>
				</span>

				<span :class="INFO_WRAPPER_CLASS"> Review times: {{ selectedDiary.reviewCount }} </span>
			</div>

			<div class="flex flex-row items-center">
				<IconButton class="mr-2">
					<template #icon>
						<ReviewCountIcon />
					</template>
				</IconButton>

				<IconButton class="mr-2" @onclick="showNoteCreationForm">
					<template #icon>
						<NewNoteIcon />
					</template>
				</IconButton>

				<IconButton>
					<template #icon>
						<EditIcon />
					</template>
				</IconButton>
			</div>
		</div>
		<SectionDivider />

		<div v-if="selectedDiary?.id && Object.keys(notesByDiary).includes(`${selectedDiary.id}`)">
			<div v-for="note in notesByDiary[`${selectedDiary.id}`]" :key="note.id">
				<div v-html="generateHTML(note.content, EXTENSIONS)" />
				<span v-if="note.sourceUrl" :class="IN_BODY_HYPER_LINK_WRAPPER_CLASS">
					<a :href="note.sourceUrl" target="_blank">Source</a>
				</span>
			</div>
		</div>
		<SectionDivider />

		<CreatedUpdatedFooter :display-object="selectedDiary" />
	</div>
</template>

<style scoped></style>
