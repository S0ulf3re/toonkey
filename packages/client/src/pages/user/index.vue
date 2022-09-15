<template>
<MkStickyContainer>
	<template #header><MkPageHeader v-model:tab="tab" :actions="headerActions" :tabs="headerTabs"/></template>
	<div v-if="user">
		<swiper
			:modules="[Virtual]"
			:space-between="20"
			:virtual="true"
			@swiper="setSwiperRef"
			@slide-change="onSlideChange"
		>
			<swiper-slide>
				<XHome :user="user"/>
			</swiper-slide>
			<swiper-slide>
				<XLikedPosts :user="user"/>
			</swiper-slide>
			<swiper-slide>
				<XReactions :user="user"/>
			</swiper-slide>
			<swiper-slide>
				<XClips :user="user"/>
			</swiper-slide>
			<swiper-slide>
				<XPages :user="user"/>
			</swiper-slide>
			<swiper-slide>
				<XGallery :user="user"/>
			</swiper-slide>
		</swiper>
	</div>
	<MkError v-else-if="error" @retry="fetchUser()"/>
	<MkLoading v-else/>
</MkStickyContainer>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, computed, inject, onMounted, onUnmounted, watch } from 'vue';
import { Virtual } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import * as Acct from 'misskey-js/built/acct';
import type * as misskey from 'misskey-js';
import { userPage, acct as getAcct } from '@/filters/user';
import * as os from '@/os';
import { useRouter } from '@/router';
import { definePageMetadata } from '@/scripts/page-metadata';
import { i18n } from '@/i18n';
import { $i } from '@/account';
import 'swiper/scss';
import 'swiper/scss/virtual';

const XHome = defineAsyncComponent(() => import('./home.vue'));
const XReactions = defineAsyncComponent(() => import('./reactions.vue'));
const XClips = defineAsyncComponent(() => import('./clips.vue'));
const XPages = defineAsyncComponent(() => import('./pages.vue'));
const XGallery = defineAsyncComponent(() => import('./gallery.vue'));

const props = withDefaults(defineProps<{
	acct: string;
	page?: string;
}>(), {
	page: 'home',
});

const router = useRouter();

let tab = $ref(props.page);
let tabs = ['home'];
let user = $ref<null | misskey.entities.UserDetailed>(null);
if (($i && ($i.id === user?.id)) || user?.publicReactions) {
	tabs.push('reactions');
}
if ((user?.instance != null)) {
	tabs.push('clips', 'pages', 'gallery');
}
let error = $ref(null);

function fetchUser(): void {
	if (props.acct == null) return;
	user = null;
	os.api('users/show', Acct.parse(props.acct)).then(u => {
		user = u;
	}).catch(err => {
		error = err;
	});
}

watch(() => props.acct, fetchUser, {
	immediate: true,
});

const headerActions = $computed(() => []);

const headerTabs = $computed(() => user ? [{
	key: 'home',
	title: i18n.ts.overview,
	icon: 'fas fa-home',
}, ...($i && ($i.id === user.id)) || user.publicReactions ? [{
	key: 'reactions',
	title: i18n.ts.reaction,
	icon: 'fas fa-laugh',
}] : [], {
	key: 'clips',
	title: i18n.ts.clips,
	icon: 'fas fa-paperclip',
}, {
	key: 'pages',
	title: i18n.ts.pages,
	icon: 'fas fa-file-alt',
}, {
	key: 'gallery',
	title: i18n.ts.gallery,
	icon: 'fas fa-icons',
}] : null);

definePageMetadata(computed(() => user ? {
	icon: 'fas fa-user',
	title: user.name ? `${user.name} (@${user.username})` : `@${user.username}`,
	subtitle: `@${getAcct(user)}`,
	userName: user,
	avatar: user,
	path: `/@${user.username}`,
	share: {
		title: user.name,
	},
} : null));

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
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.125s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
