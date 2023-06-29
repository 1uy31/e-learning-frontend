<script setup lang="ts">
import { useCategoryStore } from "@stores/category";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";

const categoryStore = useCategoryStore();
const { categories } = storeToRefs(categoryStore);

onBeforeMount(async () => {
	await categoryStore.getCategories();
});
</script>

<template>
	<nord-nav-group slot="header" heading="Category">
		<nord-nav-item v-for="category in categories" :key="category.id" href="#" icon="interface-content-book">{{
			category.name
		}}</nord-nav-item>
	</nord-nav-group>
</template>

<style scoped></style>
