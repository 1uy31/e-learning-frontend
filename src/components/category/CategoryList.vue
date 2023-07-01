<script setup lang="ts">
import { useCategoryStore } from "@stores/category";
import { storeToRefs } from "pinia";
import { onBeforeMount, onMounted } from "vue";

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);

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
			categoryComponent.addEventListener("toggle", (event) => {
				if (event.target?.active) {
					categoryStore.selectCategory(undefined);
				} else {
					categoryStore.selectCategory(categories.value[index]);
				}

				categoryComponent.toggleAttribute("active", !event.target?.active);
				categoryComponents.forEach((categoryComponentItem) => {
					if (categoryComponentItem === categoryComponent) {
						return;
					}
					categoryComponentItem.toggleAttribute("active", false);
					categoryComponentItem.open = false;
				});
			});
		});
	};
	setTimeout(registerEventListenerForCategories, 250);
});
</script>

<template>
	<nord-nav-group slot="header" heading="Category" id="id_category_sidebar">
		<nord-nav-item
			v-for="category in categories"
			:key="category.id"
			href="#"
			icon="interface-content-book"
			:badge="category.diaryCount.toString()"
			>{{ category.name }}
			<nord-nav-group slot="subnav" v-if="category.diaryCount > 0">
				<nord-nav-item href="#">Payments</nord-nav-item>
				<nord-nav-item href="#">Disputes</nord-nav-item>
			</nord-nav-group>
		</nord-nav-item>
	</nord-nav-group>
</template>

<style scoped></style>
