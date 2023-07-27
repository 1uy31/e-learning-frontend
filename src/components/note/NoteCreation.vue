<script setup lang="ts">
import ContentEditor from "@components/note/ContentEditor.vue";
import SmallSpinner from "@components/share/SmallSpinner.vue";
import { useState } from "@src/composable/useState";
import { useDiaryStore } from "@stores/diary";
import { storeToRefs } from "pinia";
import { alertIfNullUndefined } from "@src/utils";
import { MEDIUM_TIMING } from "@src/constants/timing";
import { useNoteStore } from "@stores/note";

const EMPTY_CONTENT = {
	type: "doc",
	content: [{ type: "paragraph", content: [] }],
};

const diaryStore = useDiaryStore();
const noteStore = useNoteStore();
const { selectedDiary } = storeToRefs(diaryStore);

const [formMessage, setFormMessage] = useState({ message: "", class: "" });
const [isCreatingNote, toggleIsCreatingNote] = useState(false);
const [content, setContent] = useState(EMPTY_CONTENT);

const submitNoteCreationForm = async () => {
	const form = alertIfNullUndefined(document.getElementById("id_new_note_form"), "New note form");

	const successfulCreationCallback = () => {
		setFormMessage({ message: "New note created successfully.", class: "text-green-800" });
		form.reset();

		setTimeout(() => {
			setFormMessage({ message: "", class: "" });
		}, MEDIUM_TIMING);
	};

	const formInput = new FormData(form as HTMLFormElement);
	const entries = [...formInput.entries()].reduce(
		(object, entry) => Object.assign(object, { [entry[0]]: entry[1] }),
		{}
	);

	if (!Object.keys(entries).includes("diaryId")) {
		entries["diaryId"] = selectedDiary?.value?.id;
	}
	entries["notePosition"] = Number(entries["notePosition"]);
	entries["content"] = content.value || EMPTY_CONTENT;
	const file = entries.file;
	delete entries.file;
	console.log(file);

	toggleIsCreatingNote(true);
	await noteStore.addNote(
		successfulCreationCallback,
		(error: Error) => setFormMessage({ message: error.message, class: "text-red-800" }),
		entries
	);
	toggleIsCreatingNote(false);
};
</script>

<template>
	<div
		class="mx-auto mt-12 block rounded-lg bg-stone-100 p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12"
	>
		<form id="id_new_note_form">
			<p v-if="formMessage.message" :class="'text-l mb-5 ' + formMessage.class">{{ formMessage.message }}</p>

			<div class="mb-4 mt-2 text-cyan-950 [&_input]:py-[0.6rem] [&_label]:text-cyan-700 [&_span]:top-3.5">
				<select id="id_new_note_diary" disabled data-te-select-init name="diaryId" form="id_new_note_form">
					<option value="selectedDiary?.id">
						{{ selectedDiary ? selectedDiary.topic : "Free note" }}
					</option>
				</select>
				<label data-te-select-label-ref>Diary</label>
			</div>

			<div class="relative mb-4" data-te-input-wrapper-init>
				<input
					id="id_new_note_position"
					type="number"
					class="peer block min-h-[auto] w-full rounded bg-transparent px-3 py-[0.32rem] leading-[2.15] text-cyan-950 outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
					form="id_new_note_form"
					name="notePosition"
				/>
				<label
					for="id_new_note_position"
					class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-cyan-700 transition-all duration-200 ease-out peer-focus:translate-y-[-1.15rem] peer-focus:scale-[0.8] peer-focus:text-cyan-800 peer-data-[te-input-state-active]:translate-y-[-1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
					>Note position
				</label>
			</div>

			<div class="relative mb-4" data-te-input-wrapper-init>
				<input
					id="id_new_note_source_url"
					name="sourceUrl"
					form="id_new_note_form"
					type="text"
					class="peer block min-h-[auto] w-full rounded bg-transparent px-3 py-[0.32rem] leading-[2.15] text-cyan-950 outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
				/>
				<label
					for="id_new_note_source_url"
					class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-cyan-700 transition-all duration-200 ease-out peer-focus:translate-y-[-1.15rem] peer-focus:scale-[0.8] peer-focus:text-cyan-800 peer-data-[te-input-state-active]:translate-y-[-1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
					>Source url
				</label>
			</div>

			<div class="mb-4">
				<input
					id="id_new_note_file"
					class="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.6rem] text-base font-normal text-cyan-950 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-cyan-800 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-cyan-950 focus:shadow-te-primary focus:outline-none"
					type="file"
					form="id_new_note_form"
					name="file"
				/>
			</div>

			<ContentEditor :content="content" @onchange="(_eventName, newContent) => setContent(newContent)" />

			<button
				form="id_new_note_form"
				type="button"
				class="mt-5 rounded bg-cyan-800 px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-cyan-900 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-cyan-900 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-cyan-900 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] disabled:bg-gray-400"
				data-te-ripple-init
				data-te-ripple-color="light"
				@click.prevent="submitNoteCreationForm"
			>
				<SmallSpinner v-if="isCreatingNote" status="Creating" />
				{{ !isCreatingNote ? "Create" : "" }}
			</button>
		</form>
	</div>
</template>

<style scoped></style>
