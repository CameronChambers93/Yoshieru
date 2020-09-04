<template>
    <div class="page-container">
        <md-app>

            <md-app-toolbar class="md-medium">
                <span style="margin-left:auto; margin-right: auto;" class="header md-display-1">Yosh!eru</span>
            </md-app-toolbar>

            <md-app-content style="width:99%">

                <div class="md-layout md-alignment-center">

                    <div class="main-layout-item md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                        <div class="main-md-content md-content md-elevation-10" v-if="(kuroshiro != null) && (tokenizer != null)">
                            <dictionary-container v-bind:previousEntry="previousEntry" v-bind:entry="this.currentEntry" v-on:getPreviousEntry="getPreviousEntry()" v-bind:tokenizer="tokenizer" v-bind:kuroshiro="kuroshiro" class="custom-component-container"></dictionary-container>
                        </div>

                        <div v-else class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                        </div>
                    </div>

                    <div class="main-layout-item md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                        <div class="main-md-content md-content md-elevation-10" v-if="(kuroshiro != null) && (tokenizer != null)">
                            <flashcard-container v-bind:sets="this.flashcardSets" class="custom-component-container"></flashcard-container>
                        </div>
                        <div v-else class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                            <h1>Loading...</h1>
                        </div>
                    </div>

                    <div class="main-layout-item md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                        <div class="main-md-content md-content md-elevation-10" v-if="(kuroshiro != null) && (tokenizer != null)">
                            <audio-container v-on:getEntry="getEntry" v-bind:lookupsDict="lookupsDict" v-bind:tokenizer="tokenizer" v-bind:kuroshiro="kuroshiro" class="custom-component-container"></audio-container>
                        </div>
                        <div v-else class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
                        </div>

                    </div>

                </div>

            </md-app-content>

        </md-app>
    </div>
</template>


<script>
    import axios from 'axios';
    import "regenerator-runtime/runtime";
    import Kuroshiro from 'kuroshiro';
    import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
    const kuroshiro = new Kuroshiro();
    const analyzer = new KuromojiAnalyzer({ dictPath: "/public/dict/" });
    import testDeck from './assets/testCards.json'
    import kuromoji from "kuromoji";


export default {
    name: "App",

    data () {
        return {
            posts: [{"id":"1562350","kanji":[{"common":true,"text":"話す","tags":[]},{"common":false,"text":"咄す","tags":[]}],"kana":[{"common":true,"text":"はなす","tags":[],"appliesToKanji":["*"]}],"sense":[{"partOfSpeech":["v5s","vt"],"appliesToKanji":["*"],"appliesToKana":["*"],"related":[],"antonym":[],"field":[],"dialect":[],"misc":[],"info":[],"languageSource":[],"gloss":[{"type":null,"lang":"eng","text":"to talk"},{"type":null,"lang":"eng","text":"to speak"},{"type":null,"lang":"eng","text":"to converse"},{"type":null,"lang":"eng","text":"to chat"}]},{"partOfSpeech":["v5s","vt"],"appliesToKanji":["*"],"appliesToKana":["*"],"related":[],"antonym":[],"field":[],"dialect":[],"misc":[],"info":[],"languageSource":[],"gloss":[{"type":null,"lang":"eng","text":"to tell"},{"type":null,"lang":"eng","text":"to explain"},{"type":null,"lang":"eng","text":"to narrate"},{"type":null,"lang":"eng","text":"to mention"},{"type":null,"lang":"eng","text":"to describe"},{"type":null,"lang":"eng","text":"to discuss"}]},{"partOfSpeech":["v5s","vt"],"appliesToKanji":["*"],"appliesToKana":["*"],"related":[],"antonym":[],"field":[],"dialect":[],"misc":[],"info":[],"languageSource":[],"gloss":[{"type":null,"lang":"eng","text":"to speak (a language)"}]}]}],
            entries: [],
            entry: 53355,
            endpoint: 'http://ec2-3-129-62-182.us-east-2.compute.amazonaws.com:3000/api/',
            audio: {},
            furiganaAudio: '',
            computedFilepath: '',
            currentEntry: {"id":"1562350","kanji":[{"common":true,"text":"話す","tags":[]},{"common":false,"text":"咄す","tags":[]}],"kana":[{"common":true,"text":"はなす","tags":[],"appliesToKanji":["*"]}],"sense":[{"partOfSpeech":["v5s","vt"],"appliesToKanji":["*"],"appliesToKana":["*"],"related":[],"antonym":[],"field":[],"dialect":[],"misc":[],"info":[],"languageSource":[],"gloss":[{"type":null,"lang":"eng","text":"to talk"},{"type":null,"lang":"eng","text":"to speak"},{"type":null,"lang":"eng","text":"to converse"},{"type":null,"lang":"eng","text":"to chat"}]},{"partOfSpeech":["v5s","vt"],"appliesToKanji":["*"],"appliesToKana":["*"],"related":[],"antonym":[],"field":[],"dialect":[],"misc":[],"info":[],"languageSource":[],"gloss":[{"type":null,"lang":"eng","text":"to tell"},{"type":null,"lang":"eng","text":"to explain"},{"type":null,"lang":"eng","text":"to narrate"},{"type":null,"lang":"eng","text":"to mention"},{"type":null,"lang":"eng","text":"to describe"},{"type":null,"lang":"eng","text":"to discuss"}]},{"partOfSpeech":["v5s","vt"],"appliesToKanji":["*"],"appliesToKana":["*"],"related":[],"antonym":[],"field":[],"dialect":[],"misc":[],"info":[],"languageSource":[],"gloss":[{"type":null,"lang":"eng","text":"to speak (a language)"}]}]},
            flashcardSets: {},
            kuroshiro: null,
            tokenizer: null,
            entryDict: {},
            lookupsDict: {},
            previousEntry: ""
        }
    },

    created() {
        // Import a test deck for the flash cards
        this.flashcardSets['Test Deck'] = testDeck;

        // Set up the Kuromoji tokenizer and Kuroshiro furigana-izer
        var promise = new Promise((resolve, reject) => {
            async function initAnalyzer() {
                let tokenizer = null;
                kuromoji.builder({ dicPath: "/public/dict/" }).build(function (error, _tokenizer) {
                    if (error != null) {
                        console.log(error);
                    }
                    tokenizer = _tokenizer;
                });
                await kuroshiro.init(analyzer);
                resolve(tokenizer)
            }
            initAnalyzer();
        });

        promise.then((result) => {
            console.log("Analyzer Initialized (App.vue)");
            this.tokenizer = result;
            this.kuroshiro = kuroshiro;
        }, (err) => {
                console.log("Analyzer Failed to Initialize");
            });

        this.$eventHub.$on('globalGetEntry', this.getEntry);
        this.$eventHub.$on('globalUpdateLookups', this.updateLookups);
    },

    methods: {
        updateLookups(lookup) {
            this.lookupsDict[lookup.k_ele] = lookup.id;
        },

        /* 
        */
        getEntry(id) {
            if (id != '') {

                let tmpReading = "";

                if (!this.currentEntry.hasOwnProperty("k_ele"))
                    tmpReading = this.currentEntry['kana'][0]['text'];
                else
                    tmpReading = this.currentEntry['kanji'][0]['text'];

                this.previousEntry = tmpReading

                if (this.entryDict.hasOwnProperty(id)) {
                    this.posts.push(this.entryDict[id]);
                }
                else {
                    axios.get(this.endpoint + 'entries/?entryId=' + id)
                        .then(response => {
                            this.entryDict[response.data.id] = response.data;
                            this.posts.push(response.data);
                        })
                        .catch(error => {
                            console.log('-----error-------');
                            console.log(error);
                        })
                }
            }
        },

        // Updates the Dictionary component with the previous entry
        getPreviousEntry() {
            if (this.posts.length > 1) {
                this.posts.pop();
                this.getPreviousEntryReading();
            }
        },

        // Updates the text shown in the "Previous Entry" button of the Dictionary component
        getPreviousEntryReading() {
            let tmpReading = "";
            if (this.posts.length > 2) {
                let tmpEntry = this.posts[this.posts.length - 2];
                if (!tmpEntry.hasOwnProperty("k_ele"))
                    tmpReading = tmpEntry["r_ele"][0]["reb"][0];
                else
                    tmpReading = tmpEntry["k_ele"][0]["keb"][0];
            }
            this.previousEntry = tmpReading;
        },


        
    },

    watch: {
        posts: function () {
            this.currentEntry = this.posts[this.posts.length - 1];
        }
    }
}
</script>

<style lang="scss">

    .md-app {
    
    }

    .page-container {
    
    }

    .main-md-content {
        border-radius: 10px;
        height: 680px;
    }

    .custom-component-container{
        height: 100%;
        margin-top: 0px;
        background-color: grey;
        border-radius: 10px;
    }

    .md-layout {
    }

    .main-layout-item {
        margin-left: 5px;
        margin-right: 5px;
        border-radius: 10px;
    }

    .mp-app {
        height: 1000px;
    }

    body {
        margin: 0;
        padding: 0;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }

    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    .header {

    }

    main {
        height: 800px;
        display: flex;
        max-width: 1200px;
        margin-top: 10px;
        margin-left: auto;
        margin-right: auto;
        overflow: auto;
    }


</style>
