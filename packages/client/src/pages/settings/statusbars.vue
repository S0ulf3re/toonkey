<template>
<div class="_formRoot">
	<XStatusbar v-for="x in defaultStore.state.statusbars" :key="x.id" :_id="x.id"/>
	<FormButton @click="add">add</FormButton>
</div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { v4 as uuid } from 'uuid';
import XStatusbar from './statusbars.statusbar.vue';
import FormTextarea from '@/components/form/textarea.vue';
import FormRadios from '@/components/form/radios.vue';
import FormButton from '@/components/ui/button.vue';
import * as os from '@/os';
import { menuDef } from '@/menu';
import { defaultStore } from '@/store';
import { unisonReload } from '@/scripts/unison-reload';
import { i18n } from '@/i18n';
import { definePageMetadata } from '@/scripts/page-metadata';

async function add() {
	defaultStore.push('statusbars', {
		id: uuid(),
		type: 'rss',
		props: {},
	});
}

const headerActions = $computed(() => []);

const headerTabs = $computed(() => []);

definePageMetadata({
	title: i18n.ts.statusbar,
	icon: 'fas fa-list-ul',
	bg: 'var(--bg)',
});
</script>
