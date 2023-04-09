<script setup lang="ts"></script>

<template>
	<nord-layout sticky padding="none">
		<nord-navigation slot="nav">
			<nord-nav-group heading="Category">
				<nord-nav-item href="#" active icon="navigation-dashboard">Dashboard</nord-nav-item>
			</nord-nav-group>
		</nord-navigation>

		<nord-header slot="header">
			<h1 class="n-typescale-l">Dashboard</h1>
		</nord-header>

		<nord-tab-group label="Title" sticky padding="l">
			<nord-tab slot="tab">Terminals 1</nord-tab>
			<nord-tab-panel>
				<nord-card class="mb-m">
					<h2 slot="header">Card header 2</h2>
					Card content
				</nord-card>
			</nord-tab-panel>
			<nord-tab slot="tab">Terminals 2</nord-tab>
			<nord-tab-panel>
				<nord-card class="mb-m">
					<h2 slot="header">Card header 2</h2>
					Card content
				</nord-card>
			</nord-tab-panel>
		</nord-tab-group>
	</nord-layout>
</template>

<style scoped></style>
