<script setup lang="ts">
import ContentEditor from "@components/note/ContentEditor.vue";
import SmallSpinner from "@components/share/SmallSpinner.vue";
import { useState } from "@src/composable/useState";
import { useDiaryStore } from "@stores/diary";
import { storeToRefs } from "pinia";
import { alertIfNullUndefined } from "@src/utils";
import { MEDIUM_TIMING } from "@src/constants/timing";
import { useNoteStore } from "@stores/note";
import {
	FORM_BUTTON_CLASS,
	FORM_INPUT_CLASS,
	FORM_INPUT_LABEL_CLASS,
	FORM_SELECTION_CLASS,
	LARGE_CONTAINER_CLASS,
	REQUIRED_MARK_CLASS,
} from "@src/constants/classes";
import { SUCCESS_INFO, ERROR_INFO } from "@src/constants";
import { onMounted } from "vue";

const EMPTY_CONTENT = {
	type: "doc",
	content: [{ type: "paragraph", content: [] }],
};

const diaryStore = useDiaryStore();
const noteStore = useNoteStore();
const { selectedDiary, diaries } = storeToRefs(diaryStore);

const [formMessage, setFormMessage] = useState({ message: "", class: "" });
const [isCreatingNote, toggleIsCreatingNote] = useState(false);
const [content, setContent] = useState(EMPTY_CONTENT);
const [notePosition, setNotePosition] = useState("");

const submitNoteCreationForm = async () => {
	const form = alertIfNullUndefined(document.getElementById("id_new_note_form"), "New note form");

	const successfulCreationCallback = () => {
		setFormMessage({ message: "New note created successfully.", ...SUCCESS_INFO });
		setNotePosition("");
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
		(error: Error) => setFormMessage({ message: error.message, ...ERROR_INFO }),
		entries
	);
	toggleIsCreatingNote(false);
};

onMounted(async () => {
	if (selectedDiary?.value) {
		await Promise.all([diaryStore.getAllDiaries(), diaryStore.getChildDiariesByDiary(selectedDiary.value)]);
	} else {
		await diaryStore.getAllDiaries();
	}
});
</script>

<template>
	<div :class="LARGE_CONTAINER_CLASS">
		<form id="id_new_note_form">
			<p v-if="formMessage.message" :class="'text-l mb-5 ' + formMessage.class">{{ formMessage.message }}</p>

			<SmallSpinner v-if="loadingDiaries" class="-mt-2 mb-4 border-cyan-700" status="Loading diary options" />
			<!-- UI looks buggy when v-else is used. -->
			<div :class="'mb-4 mt-2 ' + FORM_SELECTION_CLASS" :style="[loadingDiaries ? { display: 'none' } : {}]">
				<select id="id_new_note_diary" data-te-select-init name="diaryId" form="id_new_note_form">
					<option
						v-for="diary in diaries.filter((_diary) => !diaryStore.hasChildDiary(_diary.id))"
						:key="diary.id"
						:value="diary.id"
						:selected="selectedDiary?.id === diary.id"
					>
						{{ diary.topic }}
					</option>
				</select>
				<label data-te-select-label-ref>Diary</label>
			</div>

			<div class="relative mb-4" data-te-input-wrapper-init>
				<input
					id="id_new_note_position"
					type="number"
					:class="FORM_INPUT_CLASS"
					form="id_new_note_form"
					name="notePosition"
					:value="notePosition"
					@change="(event) => setNotePosition(event.target.value)"
				/>
				<label for="id_new_note_position" :class="FORM_INPUT_LABEL_CLASS"
					><span :class="REQUIRED_MARK_CLASS">*</span> Note position
				</label>
			</div>

			<div class="relative mb-4" data-te-input-wrapper-init>
				<input
					id="id_new_note_source_url"
					name="sourceUrl"
					form="id_new_note_form"
					type="text"
					:class="FORM_INPUT_CLASS"
				/>
				<label for="id_new_note_source_url" :class="FORM_INPUT_LABEL_CLASS">Source url </label>
			</div>

			<div class="mb-4">
				<input
					id="id_new_note_file"
					class="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.6rem] text-base font-normal text-cyan-950 transition duration-300 ease-in-out file:-mx-3 file:my-[-0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-cyan-800 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-cyan-950 focus:shadow-te-primary focus:outline-none"
					type="file"
					form="id_new_note_form"
					name="file"
				/>
			</div>

			<ContentEditor :content="content" @onchange="(newContent) => setContent(newContent)" />

			<button
				form="id_new_note_form"
				type="button"
				:class="'mt-5 ' + FORM_BUTTON_CLASS"
				data-te-ripple-init
				data-te-ripple-color="light"
				:disabled="['', undefined].includes(notePosition)"
				@click.prevent="submitNoteCreationForm"
			>
				<SmallSpinner v-if="isCreatingNote" status="Creating" />
				{{ !isCreatingNote ? "Create" : "" }}
			</button>
		</form>
	</div>
</template>

<style scoped></style>
