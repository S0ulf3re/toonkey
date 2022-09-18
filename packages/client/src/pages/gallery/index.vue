<template>
<MkStickyContainer>
	<template #header><MkPageHeader v-model:tab="tab" :actions="headerActions" :tabs="headerTabs"/></template>
	<MkSpacer :content-max="1200">
		<swiper
			:modules="[Virtual]"
			:space-between="20"
			:virtual="true"
			:allow-touch-move="!(deviceKind === 'desktop' && !defaultStore.state.swipeOnDesktop)"
			@swiper="setSwiperRef"
			@slide-change="onSlideChange"
		>
			<swiper-slide>
				<MkFolder class="_gap">
					<template #header><i class="fas fa-clock"></i> {{ i18n.ts.recentPosts }}</template>
					<MkPagination v-slot="{items}" :pagination="recentPostsPagination" :disable-auto-load="true" :emptyTooltip="i18n.ts.noRecentGalleryPosts">
						<div class="vfpdbgtk">
							<MkGalleryPostPreview v-for="post in items" :key="post.id" :post="post" class="post"/>
						</div>
					</MkPagination>
				</MkFolder>
				<MkFolder class="_gap">
					<template #header><i class="fas fa-fire-alt"></i> {{ i18n.ts.popularPosts }}</template>
					<MkPagination v-slot="{items}" :pagination="popularPostsPagination" :disable-auto-load="true" :emptyTooltip="i18n.ts.noPopularGalleryPosts">
						<div class="vfpdbgtk">
							<MkGalleryPostPreview v-for="post in items" :key="post.id" :post="post" class="post"/>
						</div>
					</MkPagination>
				</MkFolder>
			</swiper-slide>
			<swiper-slide>
				<MkPagination v-slot="{items}" :pagination="likedPostsPagination" :emptyTooltip="i18n.ts.noLikedGalleryPosts">
					<div class="vfpdbgtk">
						<MkGalleryPostPreview v-for="like in items" :key="like.id" :post="like.post" class="post"/>
					</div>
				</MkPagination>
			</swiper-slide>
			<swiper-slide>
				<MkA to="/gallery/new" class="_link" style="margin: 16px;"><i class="fas fa-plus"></i> {{ i18n.ts.postToGallery }}</MkA>
				<MkPagination v-slot="{items}" :pagination="myPostsPagination" :empty-tooltip="i18n.ts.noGalleries">
					<div class="vfpdbgtk">
						<MkGalleryPostPreview v-for="post in items" :key="post.id" :post="post" class="post"/>
					</div>
				</MkPagination>
			</swiper-slide>
		</swiper>
	</MkSpacer>
</MkStickyContainer>
</template>

<script lang="ts" setup>
import { computed, defineComponent, watch } from 'vue';
import { Virtual } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import MkFolder from '@/components/MkFolder.vue';
import MkPagination from '@/components/MkPagination.vue';
import MkGalleryPostPreview from '@/components/MkGalleryPostPreview.vue';
import { definePageMetadata } from '@/scripts/page-metadata';
import { deviceKind } from '@/scripts/device-kind';
import { i18n } from '@/i18n';
import { useRouter } from '@/router';
import { defaultStore } from '@/store';
import 'swiper/scss';
import 'swiper/scss/virtual';

const router = useRouter();

const props = defineProps<{
	tag?: string;
}>();

const tabs = ['explore', 'liked', 'my'];
let tab = $computed({
	get: () => tabs[0],
	set: (x) => {
		syncSlide(tabs.indexOf(x));
	},
});
let tagsRef = $ref();

const recentPostsPagination = {
	endpoint: 'gallery/posts' as const,
	limit: 6,
};
const popularPostsPagination = {
	endpoint: 'gallery/featured' as const,
	limit: 5,
};
const myPostsPagination = {
	endpoint: 'i/gallery/posts' as const,
	limit: 5,
};
const likedPostsPagination = {
	endpoint: 'i/gallery/likes' as const,
	limit: 5,
};

watch(() => props.tag, () => {
	if (tagsRef) tagsRef.tags.toggleContent(props.tag == null);
});

const headerActions = $computed(() => [{
	icon: 'fas fa-plus',
	text: i18n.ts.create,
	handler: () => {
		router.push('/gallery/new');
	},
}]);

const headerTabs = $computed(() => [{
	key: 'explore',
	title: i18n.ts.gallery,
	icon: 'fas fa-icons',
}, {
	key: 'liked',
	title: i18n.ts._gallery.liked,
	icon: 'fas fa-heart',
}, {
	key: 'my',
	title: i18n.ts._gallery.my,
	icon: 'fas fa-edit',
}]);

definePageMetadata({
	title: i18n.ts.gallery,
	icon: 'fas fa-icons',
});

let swiperRef = null;

function setSwiperRef(swiper) {
	swiperRef = swiper;
	syncSlide(tabs.indexOf(tab));
}

function onSlideChange() {
	tab = tabs[swiperRef.activeIndex];
}

function syncSlide(index) {
	swiperRef.slideTo(index);
}
</script>

<style lang="scss" scoped>
.vfpdbgtk {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
	grid-gap: 12px;
	margin: 0 var(--margin);

	> .post {

	}
}
</style>
