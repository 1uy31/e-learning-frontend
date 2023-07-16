<script setup lang="ts">
import CategoryList from "@components/category/CategoryList.vue";
// import CategoryCreation from "@components/category/CategoryCreation.vue";
// import DiaryCreation from "@components/diary/DiaryCreation.vue";
// import ParentDiaryDetail from "@components/diary/ParentDiaryDetail.vue";
import { useCategoryStore } from "@stores/category";
import { storeToRefs } from "pinia";
// import DiaryDetail from "@components/diary/DiaryDetail.vue";
import { useDiaryStore } from "@stores/diary";
// import CardSkeleton from "@components/share/CardSkeleton.vue";
import { Sidenav, initTE } from "tw-elements";
import { onMounted } from "vue";
import ColorfulSpinners from "@components/share/ColorfulSpinners.vue";

const categoryStore = useCategoryStore();
const diaryStore = useDiaryStore();
const { selectedDiary, loadingChildDiaries, childDiariesByDiary } = storeToRefs(diaryStore);
const { categoriesLoadingError, selectedCategory } = storeToRefs(categoryStore);

const hasChildDiary = (diaryId: number) => {
	if (!Object.keys(childDiariesByDiary.value).includes(`${diaryId}`)) {
		return false;
	}
	return childDiariesByDiary.value[diaryId].length > 0;
};

onMounted(() => {
	initTE({ Sidenav });
});
</script>

<template>
	<nav
		id="id_sidebar"
		class="absolute left-0 top-0 z-[1035] h-full w-60 -translate-x-full overflow-hidden bg-white shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] data-[te-sidenav-hidden='false']:translate-x-0 dark:bg-zinc-800"
		data-te-sidenav-init
		data-te-sidenav-hidden="false"
		data-te-sidenav-position="absolute"
	>
		<h1 class="text-center mt-1 text-xl text-cyan-950">Category</h1>
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

	<button
		class="m-2 inline-block rounded bg-cyan-950 px-4 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-cyan-700 hover:shadow-lg focus:bg-cyan-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-cyan-950 active:shadow-lg"
		data-te-sidenav-toggle-ref
		data-te-target="#id_sidebar"
		aria-controls="#id_sidebar"
		aria-haspopup="true"
	>
		<span class="block [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-white">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
				<path
					fill-rule="evenodd"
					d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
					clip-rule="evenodd"
				/>
			</svg>
		</span>
	</button>

	<!--	<nord-header slot="header">-->
	<!--		<h1 class="n-typescale-l">Dashboard</h1>-->
	<!--		<CategoryCreation />-->
	<!--	</nord-header>-->

	<!--	<nord-stack v-if="selectedDiary" style="margin: var(&#45;&#45;n-space-s) auto">-->
	<!--		<CardSkeleton v-if="loadingChildDiaries" />-->
	<!--		<ParentDiaryDetail v-else-if="hasChildDiary(selectedDiary.id)" />-->
	<!--		<DiaryDetail v-else />-->
	<!--	</nord-stack>-->
	<!--	<nord-stack v-else-if="!selectedCategory" style="max-width: 480px; margin: var(&#45;&#45;n-space-xl) auto">-->
	<!--		<DiaryCreation />-->
	<!--	</nord-stack>-->
</template>

<style scoped></style>
