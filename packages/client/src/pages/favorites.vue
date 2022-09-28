<template>
<MkStickyContainer>
	<template #header><MkPageHeader/></template>
	<MkSpacer :content-max="800">
		<!--ISSUE: No matter what, the 'tooltip' prop won't pass it's value to MkPagination, instead using the default prop value of i18n.ts.nothing . This seems to work normally on my-lists/index.vue and my-clips/index.vue . Trying to change the default in MkPagination.vue to the one here results in no text displaying at all-->
		<MkPagination ref="pagingComponent" :pagination="pagination" :tooltip="i18n.ts.noFavorites" icon="fas fa-star">
			<template #default="{ items }">
				<XList v-slot="{ item }" :items="items" :direction="'down'" :no-gap="false" :ad="false">
					<XNote :key="item.id" :note="item.note" :class="$style.note"/>
				</XList>
			</template>
		</MkPagination>
	</MkSpacer>
</MkStickyContainer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import MkPagination from '@/components/MkPagination.vue';
import XNote from '@/components/MkNote.vue';
import XList from '@/components/MkDateSeparatedList.vue';
import { i18n } from '@/i18n';
import { definePageMetadata } from '@/scripts/page-metadata';
//import MkEmptyIcon from '@/components/MkEmptyIcon.vue';

const pagination = {
	endpoint: 'i/favorites' as const,
	limit: 10,
};

const pagingComponent = ref<InstanceType<typeof MkPagination>>();

definePageMetadata({
	title: i18n.ts.favorites,
	icon: 'fas fa-star',
});
</script>

<style lang="scss" module>
.note {
	background: var(--panel);
	border-radius: var(--radius);
}
</style>
