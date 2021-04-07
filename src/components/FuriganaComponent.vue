<template>
    <div>
        <a style="color: black; font-size: 30px; line-height: 36px;" 
            v-for="(token, key) in tokens"
            v-bind:key='key'
            v-on:click="emitGlobalGetEntry( token.ids )"
            v-html="token.furigana">
        </a>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

    export default {
        props: {
            tokens: {
                default: () => {return []},
                type: Array
            }
        },

        created() {
        },

        methods: {
            ...mapActions('dictionary', {
                LOOKUP: 'LOOKUP'
            }),
            emitGlobalGetEntry(ids) {
                if (ids.length)
                    this.$store.dispatch('dictionary/LOOKUP', { ids })
                //this.$eventHub.$emit('globalGetEntry', id)
            }
        }
    }

</script>

<style lang="scss" scoped>

</style>
