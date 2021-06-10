<template>
    <div>
        <div id="canvas" :style="canvasStyle" style="display: grid; grid-row-gap: .5em; padding: .5em .5em;">
            <div v-for="(entry, entryKey) in entries" :key="entry.id">
                <div style="display: grid; grid-template-columns: auto auto; grid-column-gap: .5em; grid-row-gap: 2em;">
                    <div style="font-size: 1.4em" v-if="entry.furigana" v-html="entry.furigana">
                    </div>
                    <div v-else style="font-size: 1.4em" v-html="getReading(entryKey)">
                    </div>
                </div>
                <div v-for="(sense, key) in entry.sense" :key="key">
                    <div style="display: flex;">
                        <PosTag v-for="(pos, key2) in sense.pos" :key="key2" :text='pos' />
                    </div>
                    <div>
                        <div v-for="(gloss, key3) in sense.gloss" :key='key3' style="text-align: left">
                            {{ gloss }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Mixins from '../mixins/Mixins'
import PosTag from './BasicComponents/PosTag'

export default {
    components: {
        PosTag
    },
    mixins: [Mixins],
    data() {
        return {
            canvasStyle: { left: '0px', top: '0px'},
            entries: []
        }
    },
    created() {
    },
    props: {
        parent: {
            default: 'AUDIO',
            type: String
        },
        jpn: {
            default: '',
            type: String
        },
        eng: {
            default: '',
            type: String
        },
        popup: {
            default: () => {return {
                x: 0,
                y: 0,
                token: {ids: []}
            }},
            type: Object
        }
    },

    mounted() {
        this.entries = this.getEntries(this.popup.token.ids)
    },

    computed: {
    },

    methods: {
        getEntries(ids) {
            let entries = [];
            for (let i = 0; i < ids.length; i++) {
                let entry = this.getWord(ids[i]);
                entries.push(entry)
            }
            return entries
        },
        
        // For a given entry, returns the kanji (hiragana if no kanji exists for word) followed by the hiragana of the word
        getReading(index) {
            let entry = this.entries[index];
            if (entry.keb.length) {
                if (entry.furigana)
                    return entry.furigana
                else
                    this.furiganizeWord(entry.keb[0]).then((result) => {
                        this.entries[index].furigana = result
                        this.entries.splice(index, 1, this.entries[index])
                    })
                    return entry.keb[0];
            }
            else
                return entry['r_ele'][0].reb;
        },
        getHiragana(entry) {
            return entry['r_ele'][0].reb
        },
        getGloss(entry) {
            return entry.gloss
        }
    },

    watch: {
        entries: function() {
            //setTimeout(console.log(document.getElementById('canvas').clientWidth, document.getElementById('canvas').clientHeight), 200)
        }   
    }
}
</script>
<style scoped>

#canvas{
    max-width: 440px !important;
    border: 1px solid black;
    z-index: 10;
    position: fixed;
    top: 0px;
    left: 0px;
    background: white
}

.example_sentences{
    text-align: right;
}

.ex_sentence_jpn{
    font-size: 1.4rem;
}

.ex_sentence_eng{
    font-size: 1em;
    opacity: 80%;
    margin-bottom: 1rem;
}

</style>