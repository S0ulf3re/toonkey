<template>
<i v-if="icon" :class="icon"></i>
<img v-if="!icon" src="/static-assets/badges/info.png" />
</template>

<script lang="ts" setup>

const props = withDefaults(defineProps<{
	icon?: string;
}>(), {
	icon: 'fas fa-circle',
});

</script>

<style lang="scss" scoped>
i {
	font-size: 500%;	
	height: 1.2em;
}
	</style>
