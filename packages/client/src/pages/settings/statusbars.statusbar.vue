<template>
<div class="_formRoot">
	<FormSelect v-model="statusbar.type" placeholder="Please select" class="_formBlock">
		<template #label>{{ i18n.ts.type }}</template>
		<option value="rss">RSS</option>
	</FormSelect>

	<MkInput v-model="statusbar.name" class="_formBlock">
		<template #label>Name</template>
	</MkInput>

	<MkSwitch v-model="statusbar.black" class="_formBlock">
		<template #label>Black</template>
	</MkSwitch>

	<template v-if="statusbar.type === 'rss'">
		<MkInput v-model="statusbar.props.url" class="_formBlock" type="url">
			<template #label>URL</template>
		</MkInput>
		<MkInput v-model="statusbar.props.refreshInterval" class="_formBlock" type="number">
			<template #label>Refresh interval</template>
		</MkInput>
		<MkInput v-model="statusbar.props.marqueeDuration" class="_formBlock" type="number">
			<template #label>Duration</template>
		</MkInput>
		<MkSwitch v-model="statusbar.props.marqueeRverse" class="_formBlock">
			<template #label>Reverse</template>
		</MkSwitch>
	</template>

	<div style="display: flex; gap: var(--margin); flex-wrap: wrap;">
		<FormButton @click="save">save</FormButton>
		<FormButton danger @click="del">Delete</FormButton>
	</div>
</div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import FormSelect from '@/components/form/select.vue';
import MkInput from '@/components/form/input.vue';
import MkSwitch from '@/components/form/switch.vue';
import FormRadios from '@/components/form/radios.vue';
import FormButton from '@/components/ui/button.vue';
import * as os from '@/os';
import { menuDef } from '@/menu';
import { defaultStore } from '@/store';
import { i18n } from '@/i18n';

const props = defineProps<{
	_id: string;
}>();

const statusbar = reactive(JSON.parse(JSON.stringify(defaultStore.state.statusbars.find(x => x.id === props._id))));

watch(() => statusbar.type, () => {
	if (statusbar.type === 'rss') {
		statusbar.name = 'NEWS';
		statusbar.props.url = 'http://feeds.afpbb.com/rss/afpbb/afpbbnews';
		statusbar.props.refreshInterval = 60000;
		statusbar.props.display = 'marquee';
		statusbar.props.marqueeDuration = 100;
		statusbar.props.marqueeRverse = false;
	}
});

async function save() {
	const i = defaultStore.state.statusbars.findIndex(x => x.id === props._id);
	defaultStore.state.statusbars[i] = JSON.parse(JSON.stringify(statusbar));
	defaultStore.set('statusbars', defaultStore.state.statusbars);
}

function del() {
	const i = defaultStore.state.statusbars.findIndex(x => x.id === props._id);
	defaultStore.state.statusbars.splice(i, 1);
	defaultStore.set('statusbars', defaultStore.state.statusbars);
}
</script>
