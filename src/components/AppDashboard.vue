<script setup lang="ts">
import CategoryList from "@components/category/CategoryList.vue";
import CategoryCreation from "@components/category/CategoryCreation.vue";
import DiaryCreation from "@components/diary/DiaryCreation.vue";
// import ParentDiaryDetail from "@components/diary/ParentDiaryDetail.vue";
import { useCategoryStore } from "@stores/category";
import { storeToRefs } from "pinia";
// import DiaryDetail from "@components/diary/DiaryDetail.vue";
import { useDiaryStore } from "@stores/diary";
import CardSkeleton from "@components/share/CardSkeleton.vue";
import { Tab, Sidenav, initTE } from "tw-elements";
import { onMounted } from "vue";
import ColorfulSpinners from "@components/share/ColorfulSpinners.vue";
import MenuIcon from "@assets/icons/menu.svg?component";

const categoryStore = useCategoryStore();
const diaryStore = useDiaryStore();
const { selectedDiary, loadingChildDiaries, childDiariesByDiary } = storeToRefs(diaryStore);
// const { categoriesLoadingError, selectedCategory } = storeToRefs(categoryStore);
const { categoriesLoadingError } = storeToRefs(categoryStore);

const hasChildDiary = (diaryId: number) => {
	if (!Object.keys(childDiariesByDiary.value).includes(`${diaryId}`)) {
		return false;
	}
	return childDiariesByDiary.value[diaryId].length > 0;
};

onMounted(() => {
	initTE({ Tab, Sidenav });
});
</script>

<template>
	<ul id="id_app_tabs" class="mb-4 flex list-none flex-row flex-wrap border-b-0 pl-0" role="tablist" data-te-nav-ref>
		<button
			class="m-2 inline-block rounded bg-cyan-950 px-4 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-cyan-700 hover:shadow-lg focus:bg-cyan-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-cyan-950 active:shadow-lg"
			data-te-sidenav-toggle-ref
			data-te-target="#id_sidebar"
			aria-controls="#id_sidebar"
			aria-haspopup="true"
		>
			<span class="block [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-white"><MenuIcon /></span>
		</button>
		<li role="presentation">
			<a
				id="id_main_tab_home"
				href="#id_main_tab_home_content"
				class="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-cyan-950 hover:isolate hover:border-transparent hover:bg-stone-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-cyan-950 data-[te-nav-active]:text-cyan-950"
				data-te-toggle="pill"
				data-te-target="#id_main_tab_home_content"
				data-te-nav-active
				role="tab"
				aria-controls="id_main_tab_home_content"
				aria-selected="true"
				>Home</a
			>
		</li>
		<li role="presentation">
			<a
				id="id_main_tab_new_category"
				href="#id_main_tab_new_category_content"
				class="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-cyan-950 hover:isolate hover:border-transparent hover:bg-stone-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-cyan-950 data-[te-nav-active]:text-cyan-950"
				data-te-toggle="pill"
				data-te-target="#id_main_tab_new_category_content"
				role="tab"
				aria-controls="id_main_tab_new_category_content"
				aria-selected="false"
				>New Category</a
			>
		</li>
		<li role="presentation">
			<a
				id="id_main_tab_new_diary"
				href="#id_main_tab_new_diary_content"
				class="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-cyan-950 hover:isolate hover:border-transparent hover:bg-stone-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-cyan-950 data-[te-nav-active]:text-cyan-950"
				data-te-toggle="pill"
				data-te-target="#id_main_tab_new_diary_content"
				role="tab"
				aria-controls="id_main_tab_new_diary_content"
				aria-selected="false"
				>New Diary</a
			>
		</li>
	</ul>

	<div>
		<div
			id="id_main_tab_home_content"
			class="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
			role="tabpanel"
			data-te-tab-active
			aria-labelledby="id_main_tab_home"
		>
			<div v-if="selectedDiary">
				<CardSkeleton v-if="loadingChildDiaries" />
				<div v-else-if="hasChildDiary(selectedDiary.id)" />
				<!--				<ParentDiaryDetail v-else-if="hasChildDiary(selectedDiary.id)" />-->
				<!--				<DiaryDetail v-else />-->
			</div>
		</div>
		<div
			id="id_main_tab_new_category_content"
			class="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
			role="tabpanel"
			aria-labelledby="id_main_tab_new_category"
		>
			<CategoryCreation />
		</div>
		<div
			id="id_main_tab_new_diary_content"
			class="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
			role="tabpanel"
			aria-labelledby="id_main_tab_new_diary"
		>
			<DiaryCreation />
		</div>
	</div>

	<nav
		id="id_sidebar"
		class="absolute left-0 top-0 z-[1035] h-full w-60 -translate-x-full overflow-hidden bg-stone-100 shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] data-[te-sidenav-hidden='false']:translate-x-0"
		data-te-sidenav-init
		data-te-sidenav-hidden="true"
		data-te-sidenav-position="absolute"
	>
		<h1 class="mt-2 text-center text-xl text-cyan-950">Category</h1>
		<p v-if="categoriesLoadingError" class="px-2 text-red-600">
			Error on loading categories. More info: {{ categoriesLoadingError }}
		</p>
		<Suspense v-else>
			<template #default>
				<CategoryList />
			</template>
			<template #fallback>
				<ColorfulSpinners />
			</template>
		</Suspense>
	</nav>
</template>

<style scoped></style>
