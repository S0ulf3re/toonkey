<template>
<button class="nrvgflfu _button" @click="toggle">
	<b>{{ modelValue ? i18n.ts._cw.hide : i18n.ts._cw.show }}</b>
	<span v-if="!modelValue">{{ label }}</span>
</button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { length } from 'stringz';
import * as misskey from 'misskey-js';
import { concat } from '@/scripts/array';
import { i18n } from '@/i18n';

const props = defineProps<{
	modelValue: boolean;
	note: misskey.entities.Note;
}>();

const emit = defineEmits<{
	(ev: 'update:modelValue', v: boolean): void;
}>();

const label = computed(() => {
	return concat([
		props.note.text ? [i18n.t('_cw.chars', { count: length(props.note.text) })] : [],
		props.note.files && props.note.files.length !== 0 ? [i18n.t('_cw.files', { count: props.note.files.length }) ] : [],
		props.note.poll != null ? [i18n.ts.poll] : []
	] as string[][]).join(' / ');
});

const toggle = () => {
	emit('update:modelValue', !props.modelValue);
};
</script>

<style lang="scss" scoped>
.nrvgflfu {
	display: inline-block;
	padding: 4px 8px;
	font-size: 0.8em;
	color: var(--cwFg);
	background: var(--cwBg);
	padding: 6px 10px;
	width: 90%;
	border-radius: 10px;
	margin-top: 10px;
	margin-bottom: 10px;
	transition: background-color 0.25s ease-in-out;

	&:hover {
		background: var(--cwFg);
		color: var(--cwBg);
	}

	> span {
		margin-left: 4px;

		&:before {
			content: '(';
		}

		&:after {
			content: ')';
		}
	}
}
</style>
