<template>
<div class="dlrsnxqu">
	<div v-for="x in defaultStore.reactiveState.statusbars.value" :key="x.id" class="item" :class="{ black: x.black }">
		<span class="name">{{ x.name }}</span>
		<XRss v-if="x.type === 'rss'" class="body" :url="x.props.url" :refresh-interval="x.props.refreshInterval" :marquee-duration="x.props.marqueeDuration" :marquee-reverse="x.props.marqueeReverse" :display="x.props.display"/>
	</div>
</div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref, toRef, watch } from 'vue';
import * as os from '@/os';
import { defaultStore } from '@/store';
const XRss = defineAsyncComponent(() => import('./statusbar-rss.vue'));
</script>

<style lang="scss" scoped>
.dlrsnxqu {
	background: var(--panel);

	> .item {
		display: inline-flex;
		width: 100%;
		font-size: 0.85em;
		line-height: 24px;
		height: 24px;
		overflow: clip;

		> .name {
			padding: 0 6px;
			font-weight: bold;
			color: var(--accent);
		}

		> .body {
			min-width: 0;
			flex: 1;
		}

		&.black {
			background: #000;
			color: #fff;
		}
	}
}
</style>
