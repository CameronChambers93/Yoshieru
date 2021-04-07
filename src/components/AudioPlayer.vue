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
    props: {
        filepath: {         // Contains the URL to a specified audio clip
            default: '',
            type: String
        }
    }
}

</script>

<style lang="scss" scoped>

</style>
