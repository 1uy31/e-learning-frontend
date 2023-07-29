<script setup lang="ts">
import { useCategoryStore } from "@stores/category";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import { useDiaryStore } from "@stores/diary";
import { Category, Diary } from "@appTypes/dataModels";
import SmallSpinner from "@components/share/SmallSpinner.vue";
import BookIcon from "@assets/icons/book.svg?component";
import ArrowDownIcon from "@assets/icons/arrowDown.svg?component";
import { showTabById } from "@src/utils";
import { useNoteStore } from "@stores/note";

const categoryStore = useCategoryStore();
const diaryStore = useDiaryStore();
const noteStore = useNoteStore();
const { categories, selectedCategory } = storeToRefs(categoryStore);
const { diariesByCategory, loadingDiaries, selectedDiary } = storeToRefs(diaryStore);

const selectCategory = async (category: Category) => {
	if (category.id === selectedCategory?.value?.id) {
		return categoryStore.selectCategory(undefined);
	}
	categoryStore.selectCategory(category);
	if (category.noParentDiaryCount > 0) {
		await diaryStore.getDiariesByCategory(category.id);
	}
};

const selectDiary = async (diary: Diary) => {
	if (diary.id === selectedDiary?.value?.id) {
		return diaryStore.selectDiary(undefined);
	}
	diaryStore.selectDiary(diary);
	showTabById("id_main_tab_home");
	await Promise.all([noteStore.getNotesByDiary(diary), diaryStore.getChildDiariesByDiary(diary)]);
};

onBeforeMount(async () => {
	await categoryStore.getCategories();
});
</script>

<template>
	<ul id="id_sidebar_content" class="relative m-0 list-none px-[0.2rem]" data-te-sidenav-menu-ref>
		<SmallSpinner
			classes="mt-1 border-cyan-700"
			:style="[loadingDiaries ? { visibility: 'visible' } : { visibility: 'hidden' }]"
		/>
		<li v-for="category in categories" :key="category.id" class="relative">
			<a
				class="flex h-12 cursor-pointer items-center truncate rounded-[5px] px-6 py-4 text-[0.875rem] text-cyan-900 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none"
				data-te-sidenav-link-ref
				@click="selectCategory(category)"
			>
				<span class="mr-4 [&>svg]:h-4 [&>svg]:w-4">
					<BookIcon />
				</span>
				<span>{{ category.name }} </span>
				<span
					class="ml-2 inline-block whitespace-nowrap rounded-[0.27rem] bg-cyan-500 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-cyan-900"
				>
					{{ category.noParentDiaryCount || 0 }}
				</span>
				<span
					class="absolute right-0 ml-auto mr-[0.8rem] transition-transform duration-300 ease-linear motion-reduce:transition-none [&>svg]:h-4 [&>svg]:w-4"
					data-te-sidenav-rotate-icon-ref
				>
					<ArrowDownIcon />
				</span>
			</a>
			<ul
				class="!visible relative m-0 hidden list-none p-0"
				:class="[category.id === selectedCategory?.id ? 'data-[te-collapse-show]:block' : '']"
				data-te-sidenav-collapse-ref
				data-te-collapse-show
			>
				<li v-for="diary in diariesByCategory[category.id]" :key="diary.id" class="relative">
					<a
						class="flex h-6 cursor-pointer items-center rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] text-cyan-900 outline-none transition duration-300 ease-linear hover:bg-slate-50 hover:text-inherit hover:outline-none focus:bg-slate-50 focus:text-inherit focus:outline-none active:bg-slate-50 active:text-inherit active:outline-none data-[te-sidenav-state-active]:text-inherit data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none"
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
