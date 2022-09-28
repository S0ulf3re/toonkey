<template>
<i v-if="icon" :class="icon"></i>
<img v-if="!icon" src="/static-assets/badges/info.png" />
	<div v-if="tooltip">{{ tooltip }}</div>
</template>

<script lang="ts" setup>

const props = withDefaults(defineProps<{
	icon?: string;
	tooltip: string
}>(), {
	icon: 'fas fa-circle',
	tooltip: '',
});



</script>

<style lang="scss" scoped>
i {
	font-size: 500%;
	height: 1.2em;
}
	</style>
