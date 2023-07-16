<script setup lang="ts">
import CategoryList from "@components/category/CategoryList.vue";
import CategoryCreation from "@components/category/CategoryCreation.vue";
import DiaryCreation from "@components/diary/DiaryCreation.vue";
import ParentDiaryDetail from "@components/diary/ParentDiaryDetail.vue";
import { useCategoryStore } from "@stores/category";
import { storeToRefs } from "pinia";
import DiaryDetail from "@components/diary/DiaryDetail.vue";
import { useDiaryStore } from "@stores/diary";
import CardSkeleton from "@components/share/CardSkeleton.vue";
import { Sidenav, initTE, theme } from "tw-elements";
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

	<nord-header slot="header">
		<h1 class="n-typescale-l">Dashboard</h1>
		<CategoryCreation />
	</nord-header>

	<nord-stack v-if="selectedDiary" style="margin: var(--n-space-s) auto">
		<CardSkeleton v-if="loadingChildDiaries" />
		<ParentDiaryDetail v-else-if="hasChildDiary(selectedDiary.id)" />
		<DiaryDetail v-else />
	</nord-stack>
	<nord-stack v-else-if="!selectedCategory" style="max-width: 480px; margin: var(--n-space-xl) auto">
		<DiaryCreation />
	</nord-stack>
</template>

<style scoped></style>
