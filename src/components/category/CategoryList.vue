<script setup lang="ts">
import { useCategoryStore } from "@stores/category";
import { storeToRefs } from "pinia";
import { onBeforeMount, onMounted } from "vue";
import { VERY_QUICK_TIMING } from "@src/constants/timing";
import { useDiaryStore } from "@stores/diary";
import { Diary } from "@appTypes/dataModels";
import SmallSpinner from "@components/share/SmallSpinner.vue";

const categoryStore = useCategoryStore();
const diaryStore = useDiaryStore();
const { categories, selectedCategory } = storeToRefs(categoryStore);
const { diariesByCategory, loadingDiaries, selectedDiary } = storeToRefs(diaryStore);

const selectDiary = async (diary: Diary) => {
	if (diary.id === selectedDiary?.value?.id) {
		return diaryStore.selectDiary(undefined);
	}
	diaryStore.selectDiary(diary);
	await diaryStore.getChildDiariesByDiary(diary);
};

onBeforeMount(async () => {
	await categoryStore.getCategories();
});

onMounted(() => {
	const registerEventListenerForCategories = () => {
		const categoryComponents = document.querySelectorAll("#id_category_sidebar > nord-nav-item");
		if (categoryComponents.length === 0) {
			return;
		}

		categoryComponents.forEach((categoryComponent, index) => {
			categoryComponent.addEventListener("toggle", async (event) => {
				if (!event.target) {
					return;
				}
				if (event.target.active) {
					categoryStore.selectCategory(undefined);
				} else {
					const selectedCategory = categories.value[index];
					categoryStore.selectCategory(selectedCategory);
					await diaryStore.getDiariesByCategory(selectedCategory.id);
				}
			});
		});
	};
	setTimeout(registerEventListenerForCategories, VERY_QUICK_TIMING);
});
</script>

<template>
	<ul id="id_category_sidebar" class="relative m-0 list-none px-[0.2rem]" data-te-sidenav-menu-ref>
		<SmallSpinner v-if="loadingDiaries" />
		<li class="relative" v-for="category in categories" :key="category.id">
			<a
				class="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-cyan-900 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
				data-te-sidenav-link-ref
			>
				<span class="mr-4 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-gray-400 dark:[&>svg]:text-gray-300">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
						<path
							fill-rule="evenodd"
							d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</span>
				<span>{{ category.name }}</span>
				<span
					class="absolute right-0 ml-auto mr-[0.8rem] transition-transform duration-300 ease-linear motion-reduce:transition-none [&>svg]:text-gray-600 dark:[&>svg]:text-gray-300"
					data-te-sidenav-rotate-icon-ref
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
						<path
							fill-rule="evenodd"
							d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
							clip-rule="evenodd"
						/>
					</svg>
				</span>
			</a>
			<ul
				v-if="category.noParentDiaryCount > 0"
				class="!visible relative m-0 hidden list-none p-0 data-[te-collapse-show]:block"
				data-te-sidenav-collapse-ref
				data-te-collapse-show
			>
				<li class="relative" v-for="diary in diariesByCategory[category.id]" :key="diary.id">
					<a
						class="flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] text-gray-600 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
						data-te-sidenav-link-ref
						@click="selectDiary(diary)"
						>{{ diary.topic }}</a
					>
				</li>
			</ul>
		</li>
	</ul>
</template>

<style scoped></style>
