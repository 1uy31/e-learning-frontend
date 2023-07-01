<script setup lang="ts">
import CategoryList from "@components/category/CategoryList.vue";
import CategoryCreation from "@components/category/CategoryCreation.vue";
import DiaryCreation from "@components/diary/DiaryCreation.vue";
import { useCategoryStore } from "@stores/category";
import { storeToRefs } from "pinia";

const categoryStore = useCategoryStore();
const { categoriesLoadingError, selectedCategory } = storeToRefs(categoryStore);
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

		<nord-stack v-if="!selectedCategory" style="max-width: 480px; margin: var(--n-space-xl) auto">
			<DiaryCreation />
		</nord-stack>
	</nord-layout>
</template>

<style scoped></style>
