<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import "prosemirror-view/style/prosemirror.css";
import { JsonType } from "@appTypes/dataModels";
import { BubbleMenu } from "@tiptap/extension-bubble-menu";
import { onMounted } from "vue";
import { Bold } from "@tiptap/extension-bold";
import { Italic } from "@tiptap/extension-italic";
import { Strike } from "@tiptap/extension-strike";
import { MEDIUM_TIMING } from "@src/constants/timing";

const props = defineProps<{ content: JsonType }>();
const emit = defineEmits<{
	(event: "onchange", newContent: JsonType): void;
}>();

const FORMAT_BUTTON_CLASS = "mr-2 text-sm rounded-full bg-stone-300 px-2 py-0.5 hover:bg-stone-400";
const extensions = [Document, Paragraph, Text, Bold, Italic, Strike];
const editor = useEditor({
	extensions: extensions,
	editable: true,
	autofocus: false,
	injectCSS: false,
	editorProps: {
		attributes: {
			class: "text-cyan-950 prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none",
		},
	},
	onCreate: ({ editor }) => {
		editor.commands.setContent(props.content);
	},
	onUpdate: ({ editor }) => {
		const json = editor.getJSON();
		emit("onchange", json);
	},
});

onMounted(() => {
	setTimeout(
		() =>
			editor.value?.setOptions({
				extensions: [
					...extensions,
					BubbleMenu.configure({
						// shouldShow: ({ editor, view, state, oldState, from, to }) => {
						// 	return false;
						// },
					}),
				],
			}),
		MEDIUM_TIMING
	);
});
</script>

<template>
	<bubble-menu v-if="editor" :editor="editor" :tippy-options="{ duration: 100 }">
		<button :class="FORMAT_BUTTON_CLASS" @click.prevent="editor.chain().focus().toggleBold().run()">Bold</button>
		<button :class="FORMAT_BUTTON_CLASS" @click.prevent="editor.chain().focus().toggleItalic().run()">
			Italic
		</button>
		<button :class="FORMAT_BUTTON_CLASS" @click.prevent="editor.chain().focus().toggleStrike().run()">
			Strike
		</button>
	</bubble-menu>

	<EditorContent
		:editor="editor"
		style="height: 200px; border: solid 2px #e5e7eb; border-radius: 4px; overflow-y: scroll; margin-top: 4px"
	/>
</template>
