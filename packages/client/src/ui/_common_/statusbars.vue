<template>
<div>
	<div v-for="x in defaultStore.state.statusbars" :key="x.id">
		<span class="name">{{ x.name }}</span>
		<XRss v-if="x.type === 'rss'" :url="x.props.url" :speed="x.props.speed" :reverse="x.props.reverse"/>
	</div>
</div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref, toRef, watch } from 'vue';
import * as os from '@/os';
import { defaultStore } from '@/store';
const XRss = defineAsyncComponent(() => import('./statusbar-rss.vue'));
</script>
