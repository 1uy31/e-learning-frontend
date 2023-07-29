<script setup lang="ts">
import { useDiaryStore } from "@stores/diary";
import { storeToRefs } from "pinia";
import CreatedUpdatedFooter from "@components/share/CreatedUpdatedFooter.vue";
import RateDisplay from "@components/share/RateDisplay.vue";
import SectionDivider from "@components/share/SectionDivider.vue";
import EditIcon from "@assets/icons/heroicons/pencilSquare.svg?component";
import NewDiaryIcon from "@assets/icons/heroicons/documentSeries.svg?component";
import IconButton from "@components/share/IconButton.vue";
import { showTabById } from "@src/utils";
import { Diary } from "@appTypes/dataModels";
import { useNoteStore } from "@stores/note";
import {
	INFO_WRAPPER_CLASS,
	MEDIUM_CONTAINER_CLASS,
	HYPER_LINK_WRAPPER_CLASS,
	ROW_CENTER_BETWEEN_CLASS,
} from "@src/constants/classes";

const diaryStore = useDiaryStore();
const noteStore = useNoteStore();
const { selectedDiary, childDiariesByDiary } = storeToRefs(diaryStore);

const showDiaryCreationForm = () => {
	showTabById("id_main_tab_new_diary");
	const categorySelection = document.getElementById("id_new_diary_category");
	// To update parent diary selection.
	categorySelection?.dispatchEvent(new Event("change"));
};

const showDiaryDetail = async (diary: Diary) => {
	await noteStore.getNotesByDiary(diary);
	diaryStore.selectDiary(diary);
};
</script>

<template>
	<div :class="MEDIUM_CONTAINER_CLASS">
		<div :class="ROW_CENTER_BETWEEN_CLASS">
			<h2 class="text-2xl">{{ selectedDiary.topic }}</h2>
			<RateDisplay :rate="selectedDiary.rate" />
		</div>

		<div :class="'my-2 ' + ROW_CENTER_BETWEEN_CLASS">
			<span v-if="selectedDiary.sourceUrl" :class="HYPER_LINK_WRAPPER_CLASS">
				<a :href="selectedDiary.sourceUrl" target="_blank">Source</a>
			</span>
			<span v-else :class="INFO_WRAPPER_CLASS"> No/Unknown source </span>

			<div class="flex flex-row items-center">
				<IconButton class="mr-2" @onclick="showDiaryCreationForm">
					<template #icon>
						<NewDiaryIcon />
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

		<div>
			<button
				v-for="childDiary in childDiariesByDiary[`${selectedDiary.id}`]"
				:key="childDiary.id"
				type="button"
				class="mb-1 block w-full cursor-pointer rounded-lg bg-stone-200 p-4 text-left transition duration-500 hover:bg-stone-300 hover:text-cyan-950 focus:bg-stone-400 focus:text-cyan-950 focus:ring-0"
				:value="childDiary.id"
				@click="showDiaryDetail"
			>
				{{ childDiary.topic }}
			</button>
		</div>

		<SectionDivider />

		<CreatedUpdatedFooter :display-object="selectedDiary" />
	</div>
</template>

<style scoped></style>
