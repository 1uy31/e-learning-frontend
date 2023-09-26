<script setup lang="ts">
import { onMounted } from "vue";
import { initTE, Ripple } from "tw-elements";
import { FORM_BUTTON_CLASS } from "@src/constants/classes";
import SmallSpinner from "@components/share/SmallSpinner.vue";

defineProps<{ label: string; status: boolean; statusLabel: string }>();

onMounted(() => {
	initTE({ Ripple });
});
</script>

<template>
	<button type="submit" :class="FORM_BUTTON_CLASS" data-te-ripple-init data-te-ripple-color="light" v-bind="$attrs">
		<SmallSpinner v-if="status" :status="statusLabel" />
		{{ !status ? label : "" }}
	</button>
</template>

<style scoped></style>
