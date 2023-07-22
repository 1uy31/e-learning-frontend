<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

const editor = useEditor({
	content: "<p>I’m running Tiptap with Vue.js</p>",
	extensions: [Document, Paragraph, Text],
	editable: true,
	autofocus: false,
	injectCSS: false,
});
</script>

<template>
	<EditorContent :editor="editor" style="height: 50vh; border: solid 2px rgb(21 94 117); border-radius: 4px" />
</template>
