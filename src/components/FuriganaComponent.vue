<template>
    <div>
        <a :style="_style"
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
            _style: {
                default: () => { 
                    return {
                        'color': 'black',
                        'font-size': '30px',
                        'line-height': '36px',
                    }
                },
                type: Object
            },
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
