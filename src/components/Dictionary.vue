<template lang="html">
    <div>
        <md-content class="toolbar">
            <span class="toolbar-text md-display-1" v-html="reading"></span>
        </md-content>

<<<<<<< HEAD
        <md-content class="dictionary-content content md-scrollbar">
            <div style="display: flex; padding-top: .3em" v-if="entry.kanji.length != 0" class="md-headline" >
                <div>
                    Hiragana: 
                </div>
                <div style="display: block; padding-left: .3em">
            
                    <div>
                        {{ hiragana }}
                    </div>
                </div>
            </div>

            <div style="display:block; margin-top:.25em">
	            <div class="word-type-text md-headline" v-html="wordTypeText"></div>
            </div>

            <div v-if='keb.length != 0' style="display: flex; padding-top: .3em" class="md-headline">
                <div>
                    Other forms:
                </div>
                <div style="display: block; padding-left: .3em">
                    <div class="md-display-1"  style="padding-top:.25em; opacity:60%;"  v-for='value in keb'>
                        {{ value }}
                    </div>
                </div>
            </div>
            <div style="margin-top: .2em" class="md-display-1">Definitions:</div>
	        <div class="md-headline" style="margin-left: 1em"  v-for='(gloss, index) in gloss'>{{ index + 1 }}. {{ gloss }}</div>

            <div class='example_sentences'>
                <div style="text-align: left; margin-bottom:.5rem" class="md-display-1" v-if="(exampleSentences.length)">Examples:</div>
                <div v-for='(sentence, index) of exampleSentences'>
                    <div class="ex_sentence_jpn">{{ sentence.jpn_text }}</div>
                    <div class="ex_sentence_eng">{{ sentence.eng_text }}</div>
                </div>
            </div>
            <md-button style="margin-top:1em;" class="md-raised md-primary" v-on:click="$emit('getPreviousEntry')"><- {{ previousEntry }}</md-button>
            <md-button style="margin-top:1em; float: right;" class="to-deck-btn md-raised md-primary" v-on:click="atAddDialog = true">Add card to deck</md-button>

        </md-content>
        <md-dialog class="md-layout" :md-active.sync="atAddDialog">
=======
        <md-dialog style="max-height: 100%;" class="md-layout" :md-active.sync="atAddDialog">
>>>>>>> dev-branch
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
                        <div v-for='(gloss, index) in gloss' :key='index'>
                            <md-checkbox v-model="definitionSelection" :value=gloss >{{ index + 1 }}. {{ gloss }}</md-checkbox>
                        </div>
                        <div style="color: red; margin-top: -10px" v-if="definitionSelectionError == true">Please select a definition</div>
                    </md-content>
                </md-content>     
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click="closeDialog">Close</md-button>
                <md-button class="md-primary" @click="addCardToDeck">Save</md-button>
            </md-dialog-actions>
        </md-dialog>



        <md-content class="dictionary-content md-scrollbar">
            <div style="margin-top:.75em;" class="md-headline" >Hiragana: {{ hiragana }}</div>

            <div style="display:block; margin-top:.25em">
                <div class="word-type-text md-headline" v-for="(text, index) of posText" :key="index">{{ text }}</div>
            </div>

            <div style="margin: .25em 0 .25em 0;" class="md-display-1">Definitions:</div>
            
            <div style="display:flex; opacity:60%; margin-bottom:.25em;" class="md-headline"  v-for='(gloss, index) in gloss' :key='index'>
                {{ index + 1 }}.  <div style="margin-left:.25em;">{{ gloss }}</div>
            </div>

            <div style="margin-top:1em" v-if='(keb.length > 1)'>
                Other forms:
                <div>
                    <div style="padding-top:.25em; opacity:60%;" class="md-display-1"  v-for='(value, index) in keb' :key='index'>
                        {{ value }}
                    </div>
                </div>
            </div>

            <md-button style="margin-top:1em;" class="md-raised md-primary" v-on:click="getPreviousEntry">&lt;- {{ previousEntryName }}</md-button>
            <md-button style="margin-top:1em; float: right;" class="to-deck-btn md-raised md-primary" v-on:click="atAddDialog = true">Add card to deck</md-button>
        </md-content>
    </div>
</template>

<script>
    import tagDict from './../assets/tagDict.json';
//    import tagConversions from './../assets/jpnToEngTags.json';
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';


    export default {
        props: {
        },
               

<<<<<<< HEAD
    data() {
        return {
            endpoint: 'http://localhost:3000/api/',
            reading: "",                        // The text displayed in the Dictionary header
            atAddDialog: false,                 // For current dialog display.                      TODO: Replace with modal
            deckSelection: [],                  // For selecting the decks to which new flashcards will be added
            definitionSelection: [],            // For selecting which definition(s) will be added to new flashcards
            deckSelectionError: false,          // Shows error if user doesn't select a deck for adding flashcards
            definitionSelectionError: false,    // Shows error if user doesn't specify which definition(s) to add to flashcard
            exampleSentenceIDs: [],
            exampleSentences: [],
        }
    },
=======
        metaInfo() {
            return { 
                title: this.post && this.post.title,
            };
        },
>>>>>>> dev-branch

        data() {
            return {
                entry: {
                         id: ["1562350"], k_ele: [{ keb: ["話す"], ke_pri: ["ichi1", "news1", "nf21"] }, { keb: ["咄す"] }], r_ele: [{ reb: ["はなす"], re_pri: ["ichi1", "news1", "nf21"] }], sense: [{ "pos": ["v5s", "vt"], gloss: ["to talk", "to speak", "to converse", "to chat"] }, { gloss: ["to tell", "to explain", "to narrate", "to mention", "to describe", "to discuss"] }, { gloss: ["to speak (a language)"] },], pos: ['v5s', 'vt'], keb: [], gloss: [["to talk", "to speak", "to converse", "to chat"], ["to tell", "to explain", "to narrate", "to mention", "to describe", "to discuss"], ["to speak (a language)"]]
                    },
                post: {},
                atAddDialog: false,
                deckSelection: [],
                deckSelectionError: false,
                definitionSelectionError: false,
                definitionSelection: [],
                reading: "",
                updateInterval: null
            }
        },

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
            id: () => {
                if (this.entry == null)
                    return null
                else
                    return this.entry.id
            },

            // Gloss is an array containing 1 or more definitions for each entry
            gloss: function () {
                let tmpArr = [];
                for (var gloss of this.entry.gloss) {
                    let msg = "";
                    for (let i = 0; i < gloss.length; i++) {
                        msg += gloss[i] + ((i < gloss.length - 1) ? '; ' : '');
                    }
                    tmpArr.push(msg);
                }
                return tmpArr
            },

            // The reading of the entry without any Kanji
            hiragana: function () {
                return this.entry["r_ele"][0]["reb"][0]
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
            // Returns the reading of the current entry, with or without Kanji
            getReading() {
                if (!(this.entry.k_ele))    // If entry reading contains no kanji
                    this.reading = this.entry["r_ele"][0]["reb"][0];  
                else {
                    try {
                        this.$store.dispatch('analyzer/addFurigana', this.entry["k_ele"][0]["keb"][0]).then((result => {
                            this.reading = result
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
<<<<<<< HEAD
            }
            return msg
        }

    },
    
    created() {
            this.getReading();
            this.getSentenceIDs("話す")
    },
=======
                return {
                    "front": this.reading,
                    "back": back,
                    "score": 0
                }
            },
>>>>>>> dev-branch

            emitGlobalGetEntry(id) {
                id == false;
                //this.$eventHub.$emit('globalGetEntry', id)
            },

<<<<<<< HEAD
        // Returns the reading of the current entry, with or without Kanji
        getReading() {
            let tmpReading = "";
            if (this.entry.kanji.length == 0) {   // If entry reading contains no kanji
                tmpReading = this.entry['kana'][0].text;  
            }
            else {
                try {
                    if (this.tokenizer != null) {
                        tmpReading = this.addFurigana([{'furigana': this.entry['kanji'][0].text, 'index': 0, 'tokenId': ''}]);
                    }
=======
            addCardToDeck() {
                this.newCardContents = this.getNewCardContents();
                if (this.deckSelection.length == 0) {
                    this.deckSelectionError = true;
>>>>>>> dev-branch
                }
                else if (this.definitionSelection.length == 0) {
                    this.definitionSelectionError = true;
                }
<<<<<<< HEAD
            }
            if (tmpReading != undefined) {
                this.reading = tmpReading;
            }
            
        },

        /*  Adds furigana to the kanji displayed in the Dictionary header
        *   Although this method uses the same approach as in Audio.vue (processing an array of words), currently only 1 word will ever be processed in the Dictionary
        *   Will be kept in this fashion in the hopes of supporting compound words in the future
        */
        addFurigana(tokenList) {
            tokenList.sort((a, b) => a.index - b.index);    // Sorts in ascending order based on index value (Original sentence order)
            let count = 0;                                  // Used to determine if all words have yet to be processed
            for (let i = 0; i < tokenList.length; i++) {
                var promise = new Promise((resolve, reject) => {
                    async function furiganize(kuroshiro, kana, index) {
                        var result = await kuroshiro.convert(kana, { mode: "furigana", to: "hiragana" });;    // Returns the text with Furigana added
                        count += 1;
                        let response = [result, index]
                        resolve(response)
                    }
                    furiganize(this.kuroshiro, tokenList[i]['furigana'], i);
                });

                promise.then((result) => {
                    tokenList[result[1]]['furigana'] = result[0]    // Overwrites the basic text to the same text containing Furigana

                    if (count == tokenList.length) {
                        let msg = "";
                        for (var token of tokenList) {
                            msg += token.furigana + "\n";
                        }
                        this.reading = msg;
                        return "Reading: " + msg
                    }
                }, (err) => {
                    console.log(err)
                    });

            }
        },
=======
                else {
                    this.$store.commit('flashcards/addCardToDeck', 
                        {   "deckNames": this.deckSelection,
                            "card": this.newCardContents
                        });
                    this.definitionSelection = []
                    this.deckSelectionError = false;
                    this.closeDialog();
                }
            },
>>>>>>> dev-branch

            closeDialog() {
                this.deckSelectionError = false;
                this.atAddDialog = false;
            }
            
        },
        beforeDestroy() {
            clearInterval(this.updateInterval)
        },
        created() {
            this.getReading();
            //this.$eventHub.$emit('globalGetEntry', 1562350)

        },

<<<<<<< HEAD
        /* To close the 'add to deck' dialog. Will be replaced with modal in the future
        */
        closeDialog() {
            this.deckSelectionError = false;
            this.atAddDialog = false;
        },
        getSentenceIDs(reading) {
            console.log(reading)
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
            let numberOfSentences = (this.exampleSentenceIDs.length < 5) ? this.exampleSentenceIDs : 5
            for (let i = 0; i < numberOfSentences; i++) {
                axios(this.endpoint + 'sentence/?sentence_id=' + this.exampleSentenceIDs[i])
                    .then(response => {
                        console.log(response.data)
                        this.exampleSentences.push(response.data)
                    })
                    .catch(error => {
                        console.log('---error---');
                        console.log(error);
                    })
            }
        }
        
    },


    watch: {
        /* Updates the Dictionary contents when a new word is selected
        */
        entry: function (newEntry) {
            if (newEntry.kanji.length == 0) {
                this.getSentenceIDs(newEntry.kana[0].text)
            }
            else {
                this.getSentenceIDs(newEntry.kanji[0].text)
            }
            this.getReading();
        },
=======
        watch: {
            page: function(newVal) {
                this.entry = newVal[0]
            },
            entry: function () {
                this.getReading();
            },
        }
>>>>>>> dev-branch
    }
</script>

<style lang="scss" scoped>

    .dictionary-content{
        margin-left: auto;
        margin-right: auto;
        background-color: grey !important;
        height: 595px;
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
        height: 80px;
        background-color: darkolivegreen !important;
        text-align: center;
        border-radius: 10px 10px 0px 0px;
        align-items: center;
        justify-content: center;
    }

    .word-type-text {
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

    .ex_sentence_jpn{
        font-size: 1.4rem;
    }

    .ex_sentence_eng{
        font-size: 1em;
        opacity: 80%;
        margin-bottom: 1rem
    }
</style>
