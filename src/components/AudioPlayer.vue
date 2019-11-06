<template>
    <div>
        <audio controls>
            <source v-bind:src="filepath" type ="audio/mpeg">
            Your browser does not support the audio element.
        </audio >
    </div>
</template>

<script>

export default {
    props:
        ['filepath']
}

</script>

<style lang="scss" scoped>

    .audio-player {
    }
</style>
