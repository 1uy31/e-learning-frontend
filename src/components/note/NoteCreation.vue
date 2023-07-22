<script setup lang="ts">
import ContentEditor from "@components/note/ContentEditor.vue";
import SmallSpinner from "@components/share/SmallSpinner.vue";
import { useState } from "@src/composable/useState";

const [formMessage, setFormMessage] = useState({ message: "", class: "" });
const [isCreatingNote, toggleIsCreatingNote] = useState(false);
</script>

<template>
	<div
		class="mx-auto mt-12 block rounded-lg bg-stone-100 p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12"
	>
		<form id="id_new_note_form">
			<p v-if="formMessage.message" :class="'text-l mb-5 ' + formMessage.class">{{ formMessage.message }}</p>

			<div class="mb-5 flex flex-row justify-between">
				<div class="relative mr-2 w-1/2" data-te-input-wrapper-init>
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

				<div class="relative w-1/2" data-te-input-wrapper-init>
					<input
						id="id_new_note_image_url"
						name="imageUrl"
						form="id_new_note_form"
						type="text"
						class="peer block min-h-[auto] w-full rounded bg-transparent px-3 py-[0.32rem] leading-[2.15] text-cyan-950 outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
					/>
					<label
						for="id_new_note_image_url"
						class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-cyan-700 transition-all duration-200 ease-out peer-focus:translate-y-[-1.15rem] peer-focus:scale-[0.8] peer-focus:text-cyan-800 peer-data-[te-input-state-active]:translate-y-[-1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
						>Image url
					</label>
				</div>
			</div>

			<ContentEditor />

			<button
				form="id_new_note_form"
				type="button"
				class="mt-5 rounded bg-cyan-800 px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-cyan-900 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-cyan-900 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-cyan-900 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] disabled:bg-gray-400"
				data-te-ripple-init
				data-te-ripple-color="light"
				@click.prevent=""
			>
				<SmallSpinner v-if="isCreatingNote" status="Creating" />
				{{ !isCreatingNote ? "Create" : "" }}
			</button>
		</form>
	</div>
</template>

<style scoped></style>
