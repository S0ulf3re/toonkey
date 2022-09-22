<template>
	<img></img>

</template>

<script lang="ts" setup>

type ErrorIcon = {
	name: String
	imagePath: String
}

function checkIfValidFile(usingPath: ErrorIcon["imagePath"]) {
	if (usingPath === path.basename) {

	}
}

</script>

<style scoped>

</style>
