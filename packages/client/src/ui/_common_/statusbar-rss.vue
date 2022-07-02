<template>
<div>
	<MarqueeText v-if="!fetching" :key="key" :duration="speed" :reverse="reverse">
		<span v-for="item in items" class="item">
			<a class="link" :href="item.link" rel="nofollow noopener" target="_blank" :title="item.title">{{ item.title }}</a><span class="divider"></span>
		</span>
	</MarqueeText>
</div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref, toRef, watch } from 'vue';
import MarqueeText from 'vue-marquee-text-component';
import * as os from '@/os';
import { useInterval } from '@/scripts/use-interval';

const props = defineProps<{
	url: string;
	speed: number;
	reverse: boolean;
}>();

const items = ref([]);
const fetching = ref(true);
let key = $ref(0);

const tick = () => {
	fetch(`https://api.rss2json.com/v1/api.json?rss_url=${props.url}`, {}).then(res => {
		res.json().then(feed => {
			items.value = feed.items;
			fetching.value = false;
			key++;
		});
	});
};

useInterval(tick, 60000, {
	immediate: true,
	afterMounted: true,
});
</script>
