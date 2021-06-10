<template lang="html">
    <div class="grid-container">
        <div class="toolbar">
            <div style="position: absolute; left: .5em; cursor: pointer; z-index: 9999" v-on:click="openSearch">
                <md-icon>search</md-icon>
            </div>
            <span style="font-size: 2em;" class="toolbar-text md-display-1" v-html="reading"></span>
        </div>

        <md-dialog class="md-layout" :md-active.sync="atAddDialog">
            <md-dialog-title>Select Deck</md-dialog-title>
            <md-dialog-content>

                <md-content style="display: flex;">
                    <md-content class="add-to-deck-content md-layout-item">  
                        <div v-for='(name, index) in flashcardDeckNames' :key="index">
                            <md-checkbox v-model="deckSelection" :value=name>{{ name }}</md-checkbox>
                        </div>
                        <div style="color: red; margin-top: -10px" v-if="deckSelectionError == true">Please select a deck</div>
                    </md-content>
                    <md-content class="add-to-deck-content md-layout-item">  
                        <div v-for='(sense, index) in sense' :key='index'>
                            <md-checkbox v-model="definitionSelection" :value=getGloss(sense) >{{ index + 1 }}. {{ getGloss(sense) }}</md-checkbox>
                        </div>
                        <div style="color: red; margin-top: -10px" v-if="definitionSelectionError == true">Please select a definition</div>
                    </md-content>
                </md-content> 

                <div style="width: 100%; display: grid; margin-top: 1rem;;" v-if="exampleSentences[4]">
                    <md-radio v-for="n of Math.min(5, exampleSentenceIDs.length - 1)" v-model="exampleSentenceSelection" :value=n-1 :key='n'>
                        <div>{{ exampleSentences[n-1]['jpn_text'] }}</div>
                        <div>{{ exampleSentences[n-1]['eng_text'] }}</div>
                    </md-radio>
                </div>    
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click="closeDialog()">Close</md-button>
                <md-button class="md-primary" @click="addCardToDeck()">Save</md-button>
            </md-dialog-actions>
        </md-dialog>



        <div class="dictionary-content md-scrollbar">
            <div style="margin-top:.75em; text-align: left" class="md-headline" >Hiragana: {{ hiragana }}</div>
            <div v-if="isKanjiKnown" v-on:click="removeKanjiFromKnownList">
                <md-icon style="color: black; cursor: pointer">grade</md-icon>
            </div>
            <div v-else v-on:click="addKanjiToKnownList">
                <md-icon style="color: lightgrey; cursor: pointer">grade</md-icon>
            </div>

            <div style="opacity:60%; margin-bottom:.25em; font-size: 1.2rem; display: grid" class="md-headline"  v-for='(sense, index) in sense' :key='index'>
                <div style="display: flex; flex-wrap: wrap">
                    <div style="margin-left:.25em; text-align: left;" v-for="(pos, index) in sense.pos" :key='index'>
                        <PosTag :text='pos' />
                    </div>
                </div>
                <div style="display: flex; flex-wrap: wrap; text-align: left">
                    {{ getGloss(sense) }}
                </div>
            </div>

            <div style="margin-top:1em" v-if='(keb.length > 1)'>
                Other forms:
                <div style="display: flex; flex-wrap: wrap">
                    <div style="margin: .25rem .3rem .25rem .3rem; color: grey; font-size: 1.8rem;" class="md-display-1"  v-for='(value, index) in keb' :key='index'>
                        {{ value }}
                    </div>
                </div>
            </div>
            <div class='example_sentences'>
                <div style="text-align: left; margin-bottom:.5rem; font-size: 1.6rem; color: black" class="md-display-1" v-if="(exampleSentences.length)">Examples:</div>
                <div v-for='(sentence, index) of exampleSentences' :key="index">
                    <Sentence
                        :jpn="sentence.jpn_text"
                        :eng="sentence.eng_text"
                        v-bind:cStyle="exampleSentenceStyle"
                         />
                </div>
            </div>

            <md-button style="margin-top:1em;" class="md-raised md-primary" v-on:click="getPreviousEntry">&lt;- {{ previousEntryName }}</md-button>
            <md-button style="margin-top:1em; float: right;" class="to-deck-btn md-raised md-primary" v-on:click="atAddDialog = true">Add card to deck</md-button>
        
            <div v-if="searchPopup"
            class="search-popup md-elevation-3"
            >
                <div style="width: 100%">
                    <md-field style="width: 80%; margin-left: auto; margin-right: auto">
                        <form style="width: 100%" @submit.prevent="searchForWord(searchTerm)">
                            <md-input v-model="searchTerm" placeholder="Search..." style="width: 100%" />
                        </form>
                    </md-field>
                    <div class="search-results" v-if="searchResults">
                        <div v-for="entry of searchResults"
                            v-on:click="openSearchResult(entry.id)"
                            :key='entry.id'
                            class="search-result"
                            >
                            <div v-html='entry.reading' style="font-size: 1.6em" />
                            <div>{{ entry["r_ele"][0]["reb"] }}</div>
                            <div>
                                <div v-for="(sense, senseKey) of entry.sense" :key='senseKey'>
                                    <div style='display: flex;'>
                                        <div v-for="(pos, posIndex) of sense.pos" :key='posIndex'>
                                            <PosTag :text='pos' />
                                        </div>
                                    </div>
                                    <div style="text-align: left">{{ sense.gloss.join(", ") }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios'
    import tagDict from './../assets/tagDict.json';
//    import tagConversions from './../assets/jpnToEngTags.json';
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';
import Sentence from './ExampleSentence.vue'
import Mixins from '../mixins/Mixins'
import PosTag from './BasicComponents/PosTag.vue'

    export default {
        props: {
        },
               
        components: {
            Sentence, PosTag
        },

        metaInfo() {
            return { 
                title: this.post && this.post.title,
            };
        },

        data() {
            return {
                entry: {
                         id: ["1562350"], k_ele: [{ keb: ["話す"], ke_pri: ["ichi1", "news1", "nf21"], ke_inf: [] }, { keb: ["咄す"] }], r_ele: [{ reb: ["はなす"], re_pri: ["ichi1", "news1", "nf21"] }], sense: [{ "pos": ["v5s", "vt"], gloss: ["to talk", "to speak", "to converse", "to chat"] }, { gloss: ["to tell", "to explain", "to narrate", "to mention", "to describe", "to discuss"] }, { gloss: ["to speak (a language)"] },], pos: ['v5s', 'vt'], keb: [], gloss: [["to talk", "to speak", "to converse", "to chat"], ["to tell", "to explain", "to narrate", "to mention", "to describe", "to discuss"], ["to speak (a language)"]]
                    },
                post: {},
                atAddDialog: false,
                deckSelection: [],
                deckSelectionError: false,
                definitionSelectionError: false,
                definitionSelection: [],
                exampleSentenceSelection: 0,
                reading: "",
                updateInterval: null,
                endpoint: 'http://ec2-100-25-211-104.compute-1.amazonaws.com:5000/api/',
                exampleSentenceIDs: [],
                exampleSentences: [],
                searchPopup: false,
                contentHeight: 0, // Used to style the search popup
                searchTerm: '',
                searchResults: null
            }
        },
        mixins: [Mixins],
        computed: {
            ...mapState({
                page: state => state.dictionary.page,
                pageCounter: state => state.dictionary.pageCounter,
            }),
            ...mapGetters('flashcards', {
                flashcardDeckNames: 'deckNames'
            }),
            ...mapGetters('dictionary', {
                previousEntryName: 'previousEntryName'
            }),
            exampleSentenceStyle: function() {
                return {
                    color: 'black'
                }
            },
            id: () => {
                if (this.entry == null)
                    return null
                else
                    return this.entry.id
            },
            isKanjiKnown: function() {
                let id = this.entry.id
                return id in this.$store.state.user.knownKanjiIds;
            },
            // Gloss is an array containing 1 or more definitions for each entry
            sense: function () {
                return this.entry.sense
            },
            // The reading of the entry without any Kanji
            hiragana: function () {
                return this.entry["r_ele"][0]["reb"]
            },

            // The reading of the entry with Kanji (If no Kanji is present, k_ele is equivalent to this.hiragana)
            k_ele: function () {
                return this.entry["k_ele"];
            },
            posText: function() {
                let posText = []
                for (let types of this.entry.pos) {
                    let tag = types.replace(";", "");
                    posText.push(tagDict[tag]);
                }
                return posText
            },
            // keb is an array of alternative forms of the current entry
            keb: function () {
                let tmpArr = [];
                if (this.entry.keb.length > 0) {
                    for (let i = 1; i < this.entry.keb.length; i++) {
                        tmpArr.push(this.entry.keb[i]);
                    }
                }
                return tmpArr;
            },
        },

        methods: {
            ...mapActions('analyzer', ["TOKENIZE", "getCurrentPage", "getCurrentPageCounter", "addFurigana"]),
            ...mapActions('dictionary', ["getCurrentPage", "getCurrentPageCounter"]),
            ...mapMutations('dictionary', ['getPreviousEntry']),
            openSearch() {
                this.searchPopup = !this.searchPopup;
            },
            openSearchResult(id) {
                this.openSearch()
                this.$store.dispatch('dictionary/LOOKUP', { ids: [id] })
            },
            getGloss(sense) {
                let msg = '';
                for (let i = 0; i < sense.gloss.length; i++) {
                    msg += sense.gloss[i] + ( i < sense.gloss.length - 1 ? '; ' : '' )
                }
                return msg
            },
            // Returns the reading of the current entry, with or without Kanji
            getReadingA() {
                if (!(this.entry.k_ele) || ('ke_inf' in this.entry['k_ele'] && this.entry['k_ele'][0]['ke_inf'][0] == 'oK')) {    // If entry reading contains no kanji
                    this.reading = this.entry["r_ele"][0]["reb"];  
                    this.readingWithoutFurigana = this.entry["r_ele"][0]["reb"];
                }
                else {
                    try {
                        this.$store.dispatch('analyzer/addFurigana', this.entry["k_ele"][0]["keb"]).then((result => {
                            this.reading = result
                            this.readingWithoutFurigana = this.entry["k_ele"][0]["keb"]
                        }))
                    }
                    catch (exception) {
                        //tmpReading = "Error: Could not find reading"
                        this.reading = exception;
                    }
                }
            },

            // TODO: Add option for kanji/furigana
            getNewCardContents() {
                let back = "";
                for (let i = 0; i < this.definitionSelection.length; i++) {
                    back += this.definitionSelection[i];
                    if (i < this.definitionSelection.length - 1)
                        back += "\n";
                }
                return {
                    "kanji": this.readingWithoutFurigana,
                    "kana": this.hiragana,
                    "furigana": this.reading,
                    "id": this.entry.id,
                    "english": back,
                    "score": 0,
                    "date": new Date()
                }
            },

            emitGlobalGetEntry(id) {
                id == false;
                //this.$eventHub.$emit('globalGetEntry', id)
            },

            addCardToDeck() {
                this.newCardContents = this.getNewCardContents();
                if (this.deckSelection.length == 0) {
                    this.deckSelectionError = true;
                }
                else if (this.definitionSelection.length == 0) {
                    this.definitionSelectionError = true;
                }
                else {
                    this.$store.commit('flashcards/addCardToDeck', 
                        {   "deckNames": this.deckSelection,
                            "card": this.newCardContents,
                        });
                    this.definitionSelection = []
                    this.deckSelectionError = false;
                    this.closeDialog();
                }
            },
            /* To close the 'add to deck' dialog. Will be replaced with modal in the future
            */
            closeDialog() {
                this.deckSelectionError = false;
                this.atAddDialog = false;
            },
            getSentenceIDs(reading) {
                axios(this.endpoint + 'find_sentences/?k_ele=' + reading)
                        .then(response => {
                            this.exampleSentenceIDs = response.data
                            this.exampleSentences = []
                            this.getSentences()
                        })
                        .catch(error => {
                            console.log('---error---');
                            console.log(error);
                        })
            },
            getSentences() {
                let numberOfSentences = (this.exampleSentenceIDs.length < 5) ? this.exampleSentenceIDs.length : 5
                for (let i = 0; i < numberOfSentences; i++) {
                    axios(this.endpoint + 'sentence/?sentence_id=' + this.exampleSentenceIDs[i])
                        .then(response => {
                            if (response.data != '')
                                this.exampleSentences.push(response.data)
                        })
                        .catch(error => {
                            console.log('---error---');
                            console.log(error);
                        })
                }
            },
            async searchForWord(searchTerm) {
                if (searchTerm == '') {
                    this.searchResults = []
                    return
                }
                let results = this.lookupWord(searchTerm)
                let words = [];
                for (const word of results) {
                    let entry = this.getWord(word);
                    [entry.reading, entry.readingWithoutFurigana] = await this.getReading(entry);
                    words.push(entry);
                }
                this.searchResults = words
            },

            addKanjiToKnownList() {
                this.$store.dispatch('user/addEntryToFuriganaList', this.entry.id)
            },
            removeKanjiFromKnownList() {
                this.$store.dispatch('user/removeEntryFromFuriganaList', this.entry.id)
            },
            
        },
        beforeDestroy() {
            clearInterval(this.updateInterval)
        },
        created() {
            this.getReadingA();
            this.getSentenceIDs("話す");
            //this.$eventHub.$emit('globalGetEntry', 1562350)

            if (this.page[0])
                this.entry = this.page[0];
        },

        



    watch: {
            page: function(newVal) {
                this.entry = newVal[0]
                this.exampleSentenceSelection = 0;
            },
            entry: function (newEntry) {
                this.exampleSentences = []
                if (newEntry.k_ele && newEntry.k_ele.length != 0) {
                    this.getSentenceIDs(newEntry.k_ele[0].keb)
                }
                else {
                    this.getSentenceIDs(newEntry.r_ele[0].reb)
                }
                    this.getReadingA();
            },
        }
    }
</script>

<style lang="scss" scoped>

    .grid-container{
        display: grid;
        grid-template-rows: 4em auto
    }

    .dictionary-content{
        width: 100%;
        border-bottom-left-radius: .7em;
        border-bottom-right-radius: .7em;
        margin-left: auto;
        margin-right: auto;
        color: black;
        background-color: white !important;
        padding: 0px 10px 0px 10px;
        overflow: auto;
        scrollbar-width: none;  /* FireFox */
        -ms-overflow-style: none; /* IE 10+ */
        ::-webkit-scrollbar { 
        display: none; /* Chrome Safari */
    }
    }

    .toolbar {
        display: flex;
        background-color: var(--dictionary-color) !important;
        text-align: center;
        border-radius: 10px 10px 0px 0px;
        align-items: center;
        justify-content: center;
    }

    .word-type-text {
        margin: 0 .5rem 0 .5rem;
        font-size: medium;
        opacity: 60% !important;
    }

    .add-to-deck-content {
        max-height: 30em;
        overflow: auto;
        scrollbar-width: none;  /* FireFox */
        -ms-overflow-style: none; /* IE 10+ */
    }
        ::-webkit-scrollbar { 
        display: none; /* Chrome Safari */
        width: 0px;  /* Remove scrollbar space */
        background: transparent;  /* Optional: just make scrollbar invisible */
    }

    .example_sentences{
        text-align: right;
    }

    .search-popup{
        position: absolute;
        min-height: 4rem;
        height: 80%;
        overflow: auto;
        width: 100%;
        background-color: lightblue;
        left: .0px;
        top: 56px;
        z-index: 5;
        display: flex;

    }

    .search-result{
        display: grid;
        grid-template-columns: 1fr 1fr 2fr 1fr;
        align-items: center;
        cursor: pointer;
        padding: .5em 0;
    }

    .search-result:hover{
        background-color: white;
    }
</style>
