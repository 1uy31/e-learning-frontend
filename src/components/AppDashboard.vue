<script setup lang="ts">
import CategoryList from "@components/category/CategoryList.vue";
import CategoryCreation from "@components/category/CategoryCreation.vue";
import { useCategoryStore } from "@stores/category";
import { storeToRefs } from "pinia";

const categoryStore = useCategoryStore();
const { categoriesLoadingError } = storeToRefs(categoryStore);
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

		<nord-stack gap="l">
			<nord-card>
				<h2 slot="header">Card heading</h2>
				<nord-banner variant="success">
					Your order has been shipped and will arrive on May 27th. <a href="#">Track order</a>.
				</nord-banner>
			</nord-card>
		</nord-stack>
	</nord-layout>
</template>

<style scoped></style>
