<script setup lang="ts">
const GRID_GAP_CLASS = "grid grid-cols-3 gap-4";
const ROUNDED_BACKGROUND_CLASS = "h-2 rounded bg-stone-400";
</script>
<template>
	<div class="mx-auto w-full max-w-sm rounded-md border border-stone-500 p-4 shadow">
		<div class="flex animate-pulse space-x-4">
			<div class="flex-1 space-y-6 py-1">
				<div class="space-y-3">
					<div :class="GRID_GAP_CLASS">
						<div :class="'col-span-2 ' + ROUNDED_BACKGROUND_CLASS"></div>
						<div :class="'col-span-1 ' + ROUNDED_BACKGROUND_CLASS"></div>
					</div>
					<div :class="ROUNDED_BACKGROUND_CLASS"></div>
				</div>
				<div class="space-y-3">
					<div :class="GRID_GAP_CLASS">
						<div :class="'col-span-1 ' + ROUNDED_BACKGROUND_CLASS"></div>
						<div :class="'col-span-2 ' + ROUNDED_BACKGROUND_CLASS"></div>
					</div>
					<div :class="ROUNDED_BACKGROUND_CLASS"></div>
				</div>
				<div :class="ROUNDED_BACKGROUND_CLASS"></div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
