<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

const editor = useEditor({
	content: "<p>I’m running Tiptap with Vue.js</p>",
	extensions: [StarterKit],
});
</script>

<template>
	<EditorContent
		:editor="editor"
		style="
			border: 1px solid var(--n-color-border);
			border-radius: var(--n-border-radius);
			padding-inline: var(--n-space-s);
		"
	/>
</template>
