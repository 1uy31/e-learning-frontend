<script setup lang="ts"></script>
<template>
	<nord-modal id="id_note_creation_modal" size="l" aria-labelledby="title">
		<h2 id="title" slot="header">New note</h2>

		<form method="dialog" id="id_note_cration_form">
			<nord-stack>
				<nord-stack direction="horizontal">
					<nord-input label="Source url" expand></nord-input>
					<nord-input label="Image url" expand></nord-input>
				</nord-stack>

				<nord-textarea expand label="Content" resize="auto"></nord-textarea>
			</nord-stack>
		</form>

		<nord-button slot="footer" form="id_note_cration_form">Cancel</nord-button>
		<nord-button slot="footer" form="id_note_cration_form" variant="primary">Create</nord-button>
	</nord-modal>
</template>

<style scoped>
nord-textarea {
	--n-textarea-block-size: 150px;
}

@media (max-width: 640px) {
	nord-stack {
		flex-direction: column;
	}
}
</style>