import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Bold } from "@tiptap/extension-bold";
import { Italic } from "@tiptap/extension-italic";
import { Underline } from "@tiptap/extension-underline";
import { Strike } from "@tiptap/extension-strike";
import { ListItem } from "@tiptap/extension-list-item";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Heading } from "@tiptap/extension-heading";
import { Highlight } from "@tiptap/extension-highlight";
import { CodeBlock } from "@tiptap/extension-code-block";

export const SUCCESS_INFO = { class: "text-green-800" };
export const ERROR_INFO = { class: "text-red-800" };

export const EXTENSIONS = [
	Document,
	Paragraph,
	Text,
	Bold,
	Italic,
	Underline,
	Strike,
	ListItem,
	BulletList,
	Heading,
	Highlight.configure({ multicolor: true }),
	CodeBlock,
];
export const EDITOR_OPTIONS = {
	editable: true,
	autofocus: false,
	injectCSS: false,
	editorProps: {
		attributes: {
			class: "text-cyan-950 prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none",
		},
	},
	extensions: EXTENSIONS,
};
