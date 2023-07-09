<script setup lang="ts">
import { useCategoryStore } from "@stores/category";
import { storeToRefs } from "pinia";
import { onBeforeMount, onMounted } from "vue";
import { VERY_QUICK_TIMING } from "@src/constants/timing";
import { useDiaryStore } from "@stores/diary";

const categoryStore = useCategoryStore();
const diaryStore = useDiaryStore();
const { categories } = storeToRefs(categoryStore);
const { diariesByCategory, loadingDiaries } = storeToRefs(diaryStore);

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
				if (event.target?.active) {
					categoryStore.selectCategory(undefined);
				} else {
					const selectedCategory = categories.value[index];
					categoryStore.selectCategory(selectedCategory);
					await diaryStore.getByCategorizedTopic(selectedCategory.id);
				}

				categoryComponent.toggleAttribute("active", !event.target?.active);
				categoryComponents.forEach((otherCategoryComponent) => {
					if (otherCategoryComponent === categoryComponent) {
						return;
					}
					otherCategoryComponent.toggleAttribute("active", false);
				});
			});
		});
	};
	setTimeout(registerEventListenerForCategories, VERY_QUICK_TIMING);
});
</script>

<template>
	<nord-nav-group slot="header" heading="Category" id="id_category_sidebar">
		<nord-progress-bar v-if="loadingDiaries" style="margin-top: var(--n-space-s)"></nord-progress-bar>

		<nord-nav-item
			v-for="category in categories"
			:key="category.id"
			href="#"
			icon="interface-content-book"
			:badge="category.diaryCount.toString()"
			>{{ category.name }}
			<nord-nav-group slot="subnav" v-if="category.diaryCount > 0">
				<nord-nav-item v-for="diary in diariesByCategory[category.id]" :key="diary.id + 100000" href="#">{{
					diary.topic
				}}</nord-nav-item>
			</nord-nav-group>
		</nord-nav-item>
	</nord-nav-group>
</template>

<style scoped></style>
