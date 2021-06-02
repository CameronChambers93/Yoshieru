<template>
    <div id="GRID" class="grid-container">
        <div class="toolbar">
            <div v-if="currentEntry">
                <div style="cursor: pointer; z-index: 10; position: absolute; left: 1em; top: 1.2em;" v-on:click="goToPage(-1)">&larr;</div>
            </div>
            <div style="font-size: 1.2em;">EasyNews</div>
            <md-button class="md-default" @click="atNewsSettings = !atNewsSettings" style="min-width: 2em; margin-right: 1em"><md-icon style="color: white !important;">settings</md-icon></md-button>
        </div>

        
        <div v-if="atNewsSettings"
            class="settings-popup md-scrollbar"
            >
            <div class="settings-item">
                <input type="checkbox" v-model="showEnglishTitles" id="checkbox">
                <label for="checkbox">Show English</label>
            </div>
            <div class="settings-item">
                <input type="checkbox" v-model="showFurigana" id="furigana">
                <label for="furigana">Show Furigana</label>
            </div>
        </div>
        <div v-if="currentEntry" class="innerContent">
            <div>
                <div>{{ currentEntry.title.jpn }}</div>
                <div>{{ currentEntry.title.eng }}</div>
                <div></div>

                <div v-for="(paragraph) of currentEntry.paragraphs" :key='paragraph[0].jpn' class="paragraph">
                    <div v-for="(sentence) of paragraph" :key="sentence.eng" class="sentence">
                        <FuriganaComponent v-if="showFurigana" :parent='"EASYNEWS"' v-bind:tokens="sentence.furigana" v-bind:_style='{"font-size": "1.4em !important"}'>{{ sentence }}</FuriganaComponent>
                        <div v-else style="font-size: 1.4em;">{{ sentence.jpn }}</div>
                        <div style="color: grey">{{ sentence.eng }}</div>
                    </div>
                </div>
            </div>


        </div>
        <div v-else class="innerContent">
            <div style="font-size: 1.2em; text-align: left; padding-left: .4em; display: grid; grid-template-columns: 4fr 1fr;">
                <div>Title</div>
                <div>Age</div>
            </div>
            <div v-for="(obj, index) of sortedEntries" v-on:click="goToPage(index)" :key="index" class="news-title">
                <div>
                    <div style="font-size: .8em; color: grey;" v-if="showEnglishTitles">{{ obj.title.eng }}</div>
                    <div>{{ obj.title.jpn }}</div>
                </div>
                <div style="font-size: .8em;">{{ getAge(obj.date) }}</div>
            </div>
        </div>
        

    </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import Mixins from '../mixins/Mixins'
import FuriganaComponent from './FuriganaComponent'

    export default {
        props: {

            /* Decks will take the following form:
            * 'name': string
            * 'deck': [
            *     'front': string,
            *     'back': string,
            *     'score': number       
            *    ],
            * 'numCorrect': number
            */
        },

        mixins: [Mixins],

        data() {
            return {
                isBackShown: false,
                furiganaCounter: 1000,
                cardCounter: 0,
                deckCounter: 300,
                currentFront: "",
                currentBack: "",
                endpoint: 'http://ec2-100-25-211-104.compute-1.amazonaws.com:5000/api/',
                atCreateDialog: false,
                atDeckSettings: false,
                atDeckSettings2: false,
                deckName: "",
                nameError: false,
                currentCardFormatting: null,
                sentenceEng: '',
                sentenceKanji: '',
                sentenceKanjiWithFurigana: [],
                lookupSentences: false,
                showEnglishTitles: false,
                atNewsSettings: false,
                showFurigana: false,
            }
        },
        components: {
            FuriganaComponent
        },
        watch: {
        },

        created() {
            this.$store.dispatch('easynews/getPosts');
        },

        computed: {
            ...mapState({
                decks: state => state.flashcards.decks,
                currentDeck: state => state.flashcards.currentDeck,
                entries: state => state.easynews.entries,
                entryCounter: state => state.easynews.entryCounter
            }),
            ...mapGetters('easynews', {
                currentEntry: 'currentEntry'
            }),
            sortedEntries: function() {
                let e = this.entries.slice(0, this.entries.length).sort((a,b) => {return new Date(b.date) - new Date(a.date)})
                return e
            }
        },
        methods: {
            ...mapMutations('flashcards', ['setCurrentDeck', 'toMenu', 'removeCardFromDeck', 'deleteDeck']),
            ...mapActions('flashcards', ['answerCorrect', 'answerWrong']),

            /*  For a given date, returns a string with the following format:
            *     YYYY-MM-DD  
            */
            getPrettyDate(_date) {
                let date = new Date(_date);
                return `${date.getYear()}-${this.pad(date.getMonth() + 1, 2, 0)}-${this.pad(date.getDate(), 2, 0)}`
            },

            /* For a given string n, pads string with desired character to achieve desired length
            *   n: String to be padded
            *   width: Desired length of output
            *   z: Character to pad string with (default 0)
            */
            pad(n, width, z) {
                z = z || "0";
                n = n + "";
                return n.length >= width
                    ? n
                    : new Array(width - n.length + 1).join(z) + n;
            },
            getAge(_date) {
                let date = new Date(_date)
                let delta = new Date() - date;
                let days = Math.floor(delta / (3600000 * 24))
                let hours = Math.floor(delta / 3600000) % 24;
                let mins = Math.floor(delta / 60000) % 60;
                if (days == 0) {
                    if (hours == 0) {
                        if (mins < 2) {
                            return `1 minute ago`;
                        }
                        else return `${mins} minutes ago`;
                    }
                    else if (hours == 1) return '1 hour ago';
                    else return `${hours} hours ago`;
                }
                else if (days == 1) return '1 day ago';
                else return `${days} days ago`;
            },
            goToPage(index) {
                this.$store.dispatch('easynews/setCurrentEntry', {index, furiganizeSentence: this.furiganizeSentence});
            }
        }
}

</script>

<style lang="scss" scoped>

.md-icon{
    color: black !important;
}

    .grid-container{
        display: grid;
        grid-template-rows: 4em auto
    }

    .innerContent {
        color: black;
        margin: 1rem;
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 100%;
        background-color: white;
        overflow: auto;
        scrollbar-width: none;  /* FireFox */
        -ms-overflow-style: none; /* IE 10+ */
        ::-webkit-scrollbar { 
        display: none; /* Chrome Safari */
    }
    }

    .toolbar {
        display: flex;
        background-color: var(--easynews-color) !important;
        text-align: center;
        border-radius: 10px 10px 0px 0px;
        align-items: center;
        justify-content: center;
    }

    .card {
        padding: 10px;
        margin: 10px;
    }

    .new-deck-btn {
        float: right;
    }

    .news-title{
        margin: .2em .1em .2em .1em;
        padding: .5em 0 .5em 0;
        font-size: 1.4em;
        cursor: pointer;
        display: grid;
        grid-template-columns: 4fr 1fr;
        text-align: left;
    }

    .news-title:hover{
        background-color: lightblue;
        transition: all 0.3s ease;
    }

    .paragraph{
        color: black;
        margin: 1em 0 1em 0;
        display: flex;
        flex-wrap: wrap;
    }

    .paragraph:first-of-type{
        margin: .4em 0 1em 0;
    }

    .sentence{
        margin: .1em 0 .1em 0;
        padding: 0 .8em 0 .8em;
        text-align: left;
    }

    .settings-popup{
    padding: 1rem 0 1rem 0;
    position: absolute;
    width: 100%;
    background-color: grey;
    display: flex;
    flex-wrap: wrap;
    align-items: left;
    left: 0em;
    top: 4em;
    backdrop-filter: blur(2px);
    z-index: 0;
    overflow: auto;
    scrollbar-width: none;  /* FireFox */
    -ms-overflow-style: none; /* IE 10+ */
    ::-webkit-scrollbar { 
    display: none; /* Chrome Safari */
    }

    .settings-item{
        display: flex;
        height: 1.8em;
        width: 100%;
    }
}
</style>
