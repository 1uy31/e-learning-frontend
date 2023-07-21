<script setup lang="ts">
import FilledStarIcon from "@assets/icons/filledStar.svg?component";
import EmptyStarIcon from "@assets/icons/emptyStar.svg?component";

const props = defineProps<{ rate: number }>();
const rating = Math.min(props.rate || 0, 5);
</script>

<template>
	<div class="flex flex-row">
		<FilledStarIcon v-for="index in rating" :key="index" class="text-amber-400" />
		<EmptyStarIcon v-for="index in 5 - rating" :key="index + 5" class="text-amber-400" />
	</div>
</template>

<style scoped></style>
