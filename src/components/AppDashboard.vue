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
</script>

<template>
	<nord-layout sticky padding="none">
		<nord-navigation slot="nav">
			<p
				v-if="categoriesLoadingError"
				slot="header"
				style="color: var(--n-color-text-error); padding-inline-start: var(--n-space-s)"
			>
				Error on loading categories. More info: {{ categoriesLoadingError }}
			</p>
			<Suspense v-else>
				<template #default>
					<CategoryList />
				</template>
				<template #fallback>
					<div
						style="
							position: absolute;
							inset-block-start: 50%;
							inset-inline-start: 50%;
							transform: translateX(-50%) translateY(-50%);
						"
					>
						<nord-spinner size="xl" color="var(--n-color-status-progress)"></nord-spinner></div
				></template>
			</Suspense>
		</nord-navigation>

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
	</nord-layout>
</template>

<style scoped></style>
