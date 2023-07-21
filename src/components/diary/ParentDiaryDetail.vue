<script setup lang="ts">
import { useDiaryStore } from "@stores/diary";
import { storeToRefs } from "pinia";
import CreatedUpdatedFooter from "@components/share/CreatedUpdatedFooter.vue";
import RateDisplay from "@components/share/RateDisplay.vue";
import SectionDivider from "@components/share/SectionDivider.vue";
import EditIcon from "@assets/icons/pencilSquare.svg?component";

const diaryStore = useDiaryStore();
const { selectedDiary, childDiariesByDiary } = storeToRefs(diaryStore);
</script>

<template>
	<div
		class="mx-auto mt-12 block rounded-lg bg-stone-100 p-6 text-cyan-950 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12"
	>
		<div class="flex flex-row items-center justify-between">
			<h2 class="text-2xl">{{ selectedDiary.topic }}</h2>
			<RateDisplay :rate="selectedDiary.rate" />
		</div>

		<div class="my-2 flex flex-row items-center">
			<span
				v-if="selectedDiary.sourceUrl"
				class="mr-2 inline-block whitespace-nowrap rounded bg-cyan-700 p-[0.55em] text-center align-baseline text-[0.75em] font-bold leading-none text-cyan-100 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-cyan-900 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-cyan-900 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-cyan-900 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
			>
				<a :href="selectedDiary.sourceUrl" target="_blank">Source</a>
			</span>

			<button
				type="button"
				class="flex flex-row items-end justify-between rounded bg-cyan-700 py-1 pl-2.5 pr-2 text-xs leading-normal text-cyan-200 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-cyan-900 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-cyan-900 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-cyan-900 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
				data-te-ripple-init
				data-te-ripple-color="light"
			>
				<EditIcon />
			</button>
		</div>

		<SectionDivider />

		<div>
			<button
				v-for="childDiary in childDiariesByDiary[`${selectedDiary.id}`]"
				:key="childDiary.id"
				type="button"
				class="block w-full cursor-pointer rounded-lg p-4 text-left transition duration-500 hover:bg-stone-200 hover:text-cyan-950 focus:bg-stone-300 focus:text-cyan-950 focus:ring-0"
				:value="childDiary.id"
			>
				{{ childDiary.topic }}
			</button>
		</div>

		<SectionDivider />

		<CreatedUpdatedFooter :display-object="selectedDiary" />
	</div>
</template>

<style scoped></style>
