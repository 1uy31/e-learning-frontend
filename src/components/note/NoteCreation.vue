<script setup lang="ts">
import ContentEditor from "@components/note/ContentEditor.vue";
import { useState } from "@src/composable/hooks";
import { useDiaryStore } from "@stores/diary";
import { storeToRefs } from "pinia";
import { alertIfNullUndefined } from "@src/utils";
import { MEDIUM_TIMING } from "@src/constants/timing";
import { useNoteStore } from "@stores/note";
import { LARGE_CONTAINER_CLASS } from "@src/constants/classes";
import { SUCCESS_INFO, ERROR_INFO } from "@src/constants";
import { onMounted, ref } from "vue";
import { useField, useForm, useIsFormDirty, useIsFormValid, useResetForm } from "vee-validate";
import { NoteInput } from "@appTypes/dataModels";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import InputField from "@components/share/form/InputField.vue";
import FormButton from "@components/share/form/FormButton.vue";
import FormMessage from "@components/share/form/FormMessage.vue";
import SelectField from "@components/share/form/SelectField.vue";

const diaryStore = useDiaryStore();
const noteStore = useNoteStore();
const { selectedDiary, diaries, loadingDiaries } = storeToRefs(diaryStore);
const [formMessage, setFormMessage] = useState({ message: "", class: "" });
const [contentError, setContentError] = useState("");
const [isCreatingNote, toggleIsCreatingNote] = useState(false);
const contentEditor = ref<ContentEditor | null>(null);

const { values: formValues } = useForm<NoteInput>({
	initialValues: {
		diaryId: selectedDiary?.value?.id,
	},
	validationSchema: toTypedSchema(
		zod.object({
			diaryId: zod.number(),
			notePosition: zod.number(),
			sourceUrl: zod.string().optional(),
		})
	),
});

const resetForm = useResetForm();
const isFormValid = useIsFormValid();
const isFormDirty = useIsFormDirty();

const {
	value: diaryValue,
	errorMessage: diaryError,
	handleChange: handleDiaryChange,
	setValue: setDiaryValue,
} = useField("diaryId");
const {
	value: notePositionValue,
	errorMessage: notePositionError,
	handleChange: handleNotePositionChange,
} = useField("notePosition");
const {
	value: sourceUrlValue,
	errorMessage: sourceUrlError,
	handleChange: handleSourceUrlChange,
} = useField("sourceUrl");

const successfulCreationCallback = () => {
	resetForm();
	contentEditor.value.resetContent();
	setFormMessage({ message: "New note created successfully.", ...SUCCESS_INFO });

	setTimeout(() => {
		setFormMessage({ message: "", class: "" });
	}, MEDIUM_TIMING);
};

const submitNoteCreationForm = async () => {
	if (contentEditor.value.isContentEmpty()) {
		setContentError("Required");
		return;
	}
	setContentError("");

	if (!isFormValid.value || !isFormDirty.value) {
		return;
	}

	const form = alertIfNullUndefined(document.getElementById("id_new_note_form"), "New note form");
	const formInput = new FormData(form as HTMLFormElement);
	console.log(formInput);

	toggleIsCreatingNote(true);
	await noteStore.addNote(
		successfulCreationCallback,
		(error: Error) => setFormMessage({ message: error.message, ...ERROR_INFO }),
		{
			...formValues,
			content: contentEditor.value.getContent(),
			diaryId: formValues.diaryId,
		}
	);
	toggleIsCreatingNote(false);
};

onMounted(async () => {
	if (selectedDiary?.value) {
		await Promise.all([diaryStore.getAllDiaries(), diaryStore.getChildDiariesByDiary(selectedDiary.value)]);
	} else {
		await diaryStore.getAllDiaries();
	}
	alertIfNullUndefined(diaries.value[0]?.id, "", "Please create a diary first.");
	setDiaryValue(diaries.value[0].id);
});
</script>

<template>
	<div :class="LARGE_CONTAINER_CLASS">
		<form id="id_new_note_form" @submit.prevent="submitNoteCreationForm">
			<FormMessage :message="formMessage.message" :message-class="formMessage.class" />

			<SelectField
				id="id_new_note_field_diary"
				name="diaryId"
				label="Diary"
				required
				:value="diaryValue"
				:error="diaryError"
				:loading-options="loadingDiaries"
				@change="handleDiaryChange"
			>
				<template #options>
					<option
						v-for="diary in diaries.filter((_diary) => !diaryStore.hasChildDiary(_diary.id))"
						:key="diary.id"
						:value="diary.id"
					>
						{{ diary.topic }}
					</option>
				</template>
			</SelectField>

			<InputField
				id="id_new_note_field_note_position"
				name="notePosition"
				type="number"
				required
				label="Note position"
				:value="notePositionValue"
				:error="notePositionError"
				@change="handleNotePositionChange"
			/>

			<InputField
				id="id_new_note_field_source_url"
				name="sourceUrl"
				type="text"
				label="Source URL"
				:value="sourceUrlValue"
				:error="sourceUrlError"
				placeholder="Learning source url"
				@change="handleSourceUrlChange"
			/>

			<!--			TODO-->
			<!--			<div class="mb-4">-->
			<!--				<input-->
			<!--					id="id_new_note_file"-->
			<!--					class="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.6rem] text-base font-normal text-cyan-950 transition duration-300 ease-in-out file:-mx-3 file:my-[-0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-cyan-800 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-cyan-950 focus:shadow-te-primary focus:outline-none"-->
			<!--					type="file"-->
			<!--					form="id_new_note_form"-->
			<!--					name="file"-->
			<!--				/>-->
			<!--			</div>-->

			<ContentEditor id="id_new_note_field_content" ref="contentEditor" required :error="contentError" />

			<FormButton
				:aria-disabled="!notePositionValue"
				label="Create"
				:status="isCreatingNote"
				status-label="Creating"
			/>
		</form>
	</div>
</template>

<style scoped></style>
