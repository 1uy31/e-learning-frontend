<template>
	<nord-card padding="l" aria-busy="true">
		<nord-skeleton effect="sheen" slot="header"></nord-skeleton>
		<div class="skeleton-paragraph">
			<nord-skeleton effect="sheen"></nord-skeleton>
			<nord-skeleton effect="sheen"></nord-skeleton>
			<nord-skeleton effect="sheen"></nord-skeleton>
			<nord-skeleton effect="sheen"></nord-skeleton>
		</div>
		<nord-visually-hidden>Loading</nord-visually-hidden>
	</nord-card>
</template>

<style scoped>
.skeleton-paragraph nord-skeleton {
	margin-block-end: var(--n-space-m);
	width: 90%;
}
.skeleton-paragraph nord-skeleton:nth-child(2) {
	width: 70%;
}
.skeleton-paragraph nord-skeleton:last-child {
	width: 50%;
	margin-block-end: 0;
}
</style>
