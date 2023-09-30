<script setup lang="ts">
import { useEditor, EditorContent, Content } from "@tiptap/vue-3";
import "prosemirror-view/style/prosemirror.css";
import { EDITOR_OPTIONS, EMPTY_TIP_TAP_CONTENT, ERROR_INFO } from "@src/constants";
import { defineExpose } from "vue";
import { REQUIRED_MARK_CLASS } from "@src/constants/classes";

const props = defineProps<{ id: string; label?: string; content?: Content; required?: boolean; error?: string }>();
const emit = defineEmits<{
	(event: "change", newContent: Content): void;
}>();

const FORMAT_BUTTON_CLASS = "mr-2 text-sm rounded bg-stone-300 px-2 py-0.5 hover:bg-stone-400";

const editor = useEditor({
	...EDITOR_OPTIONS,
	onCreate: ({ editor }) => {
		editor.commands.setContent(props.content || EMPTY_TIP_TAP_CONTENT);
	},
	onUpdate: ({ editor }) => {
		emit("change", editor.getJSON());
	},
});

const getToolStyle = (toolName: string, attributes: Record<string, string | number> = {}, activeColor?: string) => {
	if (editor.value?.isActive(toolName, attributes)) {
		return { backgroundColor: activeColor || "#78716c" };
	}
	return {};
};

const isContentEmpty = () => editor.value?.getText().length === 0;
const getContent = () => {
	if (editor.value) {
		return editor.value.getJSON();
	}
	return EMPTY_TIP_TAP_CONTENT;
};
const resetContent = () => editor.value?.commands.setContent(EMPTY_TIP_TAP_CONTENT);

defineExpose({
	isContentEmpty,
	getContent,
	resetContent,
});
</script>

<template>
	<label :for="id" class="text-cyan-700"
		><span v-if="required" :class="REQUIRED_MARK_CLASS">*</span> {{ label || "Content" }}
	</label>
	<div v-if="editor" :editor="editor" :tippy-options="{ duration: 100 }" class="mt-2">
		<button
			:class="FORMAT_BUTTON_CLASS"
			:style="getToolStyle('heading', { level: 1 })"
			@click.prevent="editor.chain().focus().toggleHeading({ level: 1 }).run()"
		>
			H1
		</button>
		<button
			:class="FORMAT_BUTTON_CLASS"
			:style="getToolStyle('heading', { level: 2 })"
			@click.prevent="editor.chain().focus().toggleHeading({ level: 2 }).run()"
		>
			H2
		</button>
		<button
			:class="FORMAT_BUTTON_CLASS"
			:style="getToolStyle('heading', { level: 3 })"
			@click.prevent="editor.chain().focus().toggleHeading({ level: 3 }).run()"
		>
			H3
		</button>
		<button
			:class="'bg-yellow-300 hover:bg-yellow-400 ' + FORMAT_BUTTON_CLASS"
			:style="getToolStyle('highlight', { color: '#fde047' }, '#ca8a04')"
			@click.prevent="editor.chain().focus().toggleHighlight({ color: '#fde047' }).run()"
		>
			@
		</button>
		<button
			:class="'bg-teal-300 hover:bg-teal-400 ' + FORMAT_BUTTON_CLASS"
			:style="getToolStyle('highlight', { color: '#5eead4' }, '#0d9488')"
			@click.prevent="editor.chain().focus().toggleHighlight({ color: '#5eead4' }).run()"
		>
			@
		</button>
		<button
			class="mr-2 rounded bg-rose-300 px-2 py-0.5 text-sm hover:bg-rose-400"
			:style="getToolStyle('highlight', { color: '#fda4af' }, '#e11d48')"
			@click.prevent="editor.chain().focus().toggleHighlight({ color: '#fda4af' }).run()"
		>
			@
		</button>
		<button
			:class="FORMAT_BUTTON_CLASS"
			:style="getToolStyle('bold')"
			@click.prevent="editor.chain().focus().toggleBold().run()"
		>
			B
		</button>
		<button
			:class="FORMAT_BUTTON_CLASS"
			:style="getToolStyle('italic')"
			@click.prevent="editor.chain().focus().toggleItalic().run()"
		>
			I
		</button>
		<button
			:class="FORMAT_BUTTON_CLASS"
			:style="getToolStyle('underline')"
			@click.prevent="editor.chain().focus().toggleUnderline().run()"
		>
			U
		</button>
		<button
			:class="FORMAT_BUTTON_CLASS"
			:style="getToolStyle('strike')"
			@click.prevent="editor.chain().focus().toggleStrike().run()"
		>
			S
		</button>
		<button
			:class="FORMAT_BUTTON_CLASS"
			:style="getToolStyle('bulletList')"
			@click.prevent="editor.chain().focus().toggleBulletList().run()"
		>
			•
		</button>
		<button
			:class="FORMAT_BUTTON_CLASS"
			:style="getToolStyle('codeBlock')"
			@click.prevent="editor.chain().focus().toggleCodeBlock().run()"
		>
			Code
		</button>
	</div>

	<EditorContent
		:id="id"
		:aria-describedby="`${id}_error`"
		:aria-invalid="error ? true : null"
		:editor="editor"
		style="height: 240px; border: solid 2px #e5e7eb; border-radius: 4px; overflow-y: scroll; margin-block: 1rem"
	/>
	<p v-if="error" :id="`${id}_error`" :class="'text-l -mt-2 mb-5 ' + ERROR_INFO.class">
		{{ error }}
	</p>
</template>

<style>
.ProseMirror ul {
	padding: 0 1rem;
	list-style: disc;
}
</style>
