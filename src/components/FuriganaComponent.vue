<template>
    <div>
        <a style="color: black; font-size: 30px; line-height: 36px;" v-for="tokens in html" v-on:click="emitGlobalGetEntry( tokens.id )" v-html="tokens.furigana"></a>
    </div>
</template>

<script>

    export default {
        props:
            ['html'],

        created() {
        },

        methods: {
            emitGlobalGetEntry(id) {
                this.$eventHub.$emit('globalGetEntry', id)
            }
        }
    }

</script>

<style lang="scss" scoped>

    a {
    }
</style>
