<template>
<span v-if="!fetching" class="xbhtxfms">
	<template v-if="display === 'marquee'">
		<transition name="fade" mode="default">
			<MarqueeText :key="key" :duration="marqueeDuration" :reverse="marqueeReverse">
				<span v-for="item in items" class="item">
					<a class="link" :href="item.link" rel="nofollow noopener" target="_blank" :title="item.title">{{ item.title }}</a><span class="divider"></span>
				</span>
			</MarqueeText>
		</transition>
	</template>
	<template v-else-if="display === 'oneByOne'">
		<!-- TODO -->
	</template>
</span>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref, toRef, watch } from 'vue';
import MarqueeText from '@/components/marquee.vue';
import * as os from '@/os';
import { useInterval } from '@/scripts/use-interval';

const props = defineProps<{
	url?: string;
	display?: 'marquee' | 'oneByOne';
	marqueeDuration?: number;
	marqueeReverse?: boolean;
	oneByOneInterval: number;
	refreshInterval?: number;
}>();

const items = ref([]);
const fetching = ref(true);
let key = $ref(0);

const tick = () => {
	fetch(`/api/fetch-rss?url=${props.url}`, {}).then(res => {
		res.json().then(feed => {
			items.value = feed.items;
			fetching.value = false;
			key++;
		});
	});
};

useInterval(tick, Math.max(5000, props.refreshInterval ?? 5000), {
	immediate: true,
	afterMounted: true,
});
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
	position: absolute;
	top: 0;
  transition: all 1s ease;
}
.fade-enter-from {
  opacity: 0;
	transform: translateY(-100%);
}
.fade-leave-to {
  opacity: 0;
	transform: translateY(100%);
}

.xbhtxfms {
	display: inline-block;
	position: relative;

	::v-deep(.item) {
		display: inline-flex;
		align-items: center;
		vertical-align: bottom;
		margin: 0;

		> .divider {
			display: inline-block;
			width: 0.5px;
			height: 16px;
			margin: 0 1em;
			background: currentColor;
			opacity: 0.7;
		}
	}
}
</style>
