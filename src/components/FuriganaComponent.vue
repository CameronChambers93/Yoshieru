<template>
    <div>
        <a :style="token.style || styleString ||  _style"
            v-for="(token, key) in tokens"
            v-bind:key='key'
            v-on:click="defineWord( token.ids )"
            v-on:mouseover="popupWord($event, token )"
            v-on:mouseleave="closePopup"
            v-html="(isKanjiKnown(token)) ? token.text : token.furigana">
        </a>
        <WordPopup
            v-if="popup && popup.token.ids.length"
            :parent='parent'
            :popup="popup"
            />
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import WordPopup from './WordPopup'

    export default {
        components: {
            WordPopup
        },
        props: {
            parent: {
                default: 'AUDIO',
                type: String
            },
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
            styleString: {  // Used to apply user's custom style to furigana
                default: '',
                type: String
            },
            tokens: {
                default: () => {return []},
                type: Array
            }
        },

        computed: {
        },

        created() {
        },

        data() {
            return {
                popup: null
            }
        },

        methods: {
            ...mapActions('dictionary', {
                LOOKUP: 'LOOKUP'
            }),
            defineWord(ids) {
                console.log(ids)
                if (ids.length)
                    this.$store.dispatch('dictionary/LOOKUP', { ids })
                //this.$eventHub.$emit('globalGetEntry', id)
            },
            popupWord(event, token) {
                this.popup = {}
                let x = event.clientX;
                //let y = (this.parent == 'AUDIO') ? event.layerY : event.clientY;
                let y = event.clientY;
                this.popup = Object.assign({}, {x, y, token})
            },
            closePopup() {
                this.popup = null;
            },
            isKanjiKnown(token) {
                if (token.ids.length == 0)
                    return false
                return token.ids[0] in this.$store.state.user.knownKanjiIds;
            }
        }
    }

</script>

<style lang="scss" scoped>

</style>
