<script setup lang="ts">
import { useCategoryStore } from "@stores/category";
import { storeToRefs } from "pinia";
import { onBeforeMount, onMounted } from "vue";
import { VERY_QUICK_TIMING } from "@src/constants/timing";
import { useDiaryStore } from "@stores/diary";
import { Diary } from "@appTypes/dataModels";
import SmallSpinner from "@components/share/SmallSpinner.vue";
import BookIcon from "@assets/icons/book.svg?component";
import ArrowDownIcon from "@assets/icons/arrowDown.svg?component";

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
	<ul id="id_sidebar_content" class="relative m-0 list-none px-[0.2rem]" data-te-sidenav-menu-ref>
		<SmallSpinner v-if="loadingDiaries" />
		<li class="relative" v-for="category in categories" :key="category.id">
			<a
				class="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-cyan-900 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:active:bg-white/10"
				data-te-sidenav-link-ref
			>
				<span class="mr-4 [&>svg]:h-4 [&>svg]:w-4">
					<BookIcon />
				</span>
				<span>{{ category.name }}</span>
				<span
					class="absolute right-0 ml-auto mr-[0.8rem] [&>svg]:h-4 [&>svg]:w-4 transition-transform duration-300 ease-linear motion-reduce:transition-none"
					data-te-sidenav-rotate-icon-ref
				>
					<ArrowDownIcon />
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
