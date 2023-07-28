<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import "prosemirror-view/style/prosemirror.css";
import { JsonType } from "@appTypes/dataModels";
import { Bold } from "@tiptap/extension-bold";
import { Italic } from "@tiptap/extension-italic";
import { Strike } from "@tiptap/extension-strike";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Heading } from "@tiptap/extension-heading";
import { Highlight } from "@tiptap/extension-highlight";
import { ListItem } from "@tiptap/extension-list-item";

const props = defineProps<{ content: JsonType }>();
const emit = defineEmits<{
	(event: "onchange", newContent: JsonType): void;
}>();

const FORMAT_BUTTON_CLASS = "mr-2 text-sm rounded-full bg-stone-300 px-2 py-0.5 hover:bg-stone-400";
const extensions = [
	Document,
	Paragraph,
	Text,
	Bold,
	Italic,
	Strike,
	BulletList,
	ListItem,
	Heading,
	Highlight.configure({ multicolor: true }),
];
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
</script>

<template>
	<div v-if="editor" :editor="editor" :tippy-options="{ duration: 100 }">
		<button :class="FORMAT_BUTTON_CLASS" @click.prevent="editor.chain().focus().toggleBold().run()">Bold</button>
		<button :class="FORMAT_BUTTON_CLASS" @click.prevent="editor.chain().focus().toggleItalic().run()">
			Italic
		</button>
		<button :class="FORMAT_BUTTON_CLASS" @click.prevent="editor.chain().focus().toggleStrike().run()">
			Strike
		</button>
		<button :class="FORMAT_BUTTON_CLASS" @click.prevent="editor.chain().focus().toggleHeading({ level: 1 }).run()">
			H1
		</button>
		<button :class="FORMAT_BUTTON_CLASS" @click.prevent="editor.chain().focus().toggleHeading({ level: 2 }).run()">
			H2
		</button>
		<button
			:class="'bg-yellow-300 hover:bg-yellow-400 ' + FORMAT_BUTTON_CLASS"
			@click.prevent="editor.chain().focus().toggleHighlight({ color: 'rgb(250 204 21)' }).run()"
		>
			Yellow
		</button>
		<button
			:class="'bg-teal-300 hover:bg-teal-400 ' + FORMAT_BUTTON_CLASS"
			@click.prevent="editor.chain().focus().toggleHighlight({ color: 'rgb(45 212 191)' }).run()"
		>
			Teal
		</button>
		<button
			:class="'bg-pink-300 hover:bg-pink-400 ' + FORMAT_BUTTON_CLASS"
			@click.prevent="editor.chain().focus().toggleHighlight({ color: 'rgb(244 114 182)' }).run()"
		>
			Pink
		</button>
	</div>
	<div class="mt-1">
		<button :class="FORMAT_BUTTON_CLASS" @click.prevent="editor.chain().focus().toggleBulletList().run()">
			Bullet
		</button>
	</div>

	<EditorContent
		:editor="editor"
		style="height: 200px; border: solid 2px #e5e7eb; border-radius: 4px; overflow-y: scroll; margin-top: 4px"
	/>
</template>
