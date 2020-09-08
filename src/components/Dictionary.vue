<template lang="html">
    <div>
        <md-content class="toolbar">
            <span class="toolbar-text md-display-1" v-html="reading"></span>
        </md-content>

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
            <md-button style="margin-top:1em;" class="md-raised md-primary" v-on:click="$emit('getPreviousEntry')"><- {{ previousEntry }}</md-button>
            <md-button style="margin-top:1em; float: right;" class="to-deck-btn md-raised md-primary" v-on:click="atAddDialog = true">Add card to deck</md-button>

        </md-content>
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




        <md-dialog style="max-height: 100%;"class="md-layout" :md-active.sync="atAddDialog">
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
    </div>
</template>

<script>
import axios from 'axios';
import tagDict from './../assets/tagDict.json';

export default {
    props: {
        entry: {                // The current word shown in the dictionary
            default: () => {
                return {
                        
                }
            },
            type: Object
        },
        previousEntry: {        // The previous dictionary entry, for the 'back' button
            default: "",
            type: String
        },
        tokenizer: {            // Analyzes sentences and breaks them into individual words (tokens)
            default: () => {
                return null
            },
            type: Object
        },
        kuroshiro: {            // Adds furigana to kanji
            default: () => {
                return null
            },
            type: Object
        },
        flashcardDeckNames: {   // List of deck names, for adding new cards to decks
            default: () => {
                return []
            },
            type: Array
        }

    },

    data() {
        return {
            reading: "",                        // The text displayed in the Dictionary header
            atAddDialog: false,                 // For current dialog display.                      TODO: Replace with modal
            deckSelection: [],                  // For selecting the decks to which new flashcards will be added
            definitionSelection: [],            // For selecting which definition(s) will be added to new flashcards
            deckSelectionError: false,          // Shows error if user doesn't select a deck for adding flashcards
            definitionSelectionError: false,    // Shows error if user doesn't specify which definition(s) to add to flashcard
        }
    },

    computed: {
        
        // The ID of each entry corresponding to its ID in the JMDict file
        id: () => {
            if (this.entry == null)
                return null
            else
                return this.entry.id
        },

        // Gloss (glossary) is an array containing 1 or more definitions for each entry
        gloss: function () {
            let tmpArr = [];
            if (this.entry["sense"] != null)
                for (var sense of this.entry.sense) {
                    let msg = "";
                    for (let i = 0; i < sense.gloss.length; i++) {
                        msg += sense.gloss[i]['text'] + ((i < sense.gloss.length - 1) ? '; ' : '');
                    }
                    tmpArr.push(msg);
                }
            return tmpArr
        },

        // The primary reading of the entry (without any kanji)
        hiragana: function () {
            if (this.kanji.length == 0) {
                return ""
            }
            else return this.kana[0]['text']
        },

        // Readings of the current word with kanji included (for words w/o kanji, this will be an emptry array)
        kanji: function () {
            return this.entry["kanji"];
        },

        // Readings of the current word without kanji
        kana: function() {
            return this.entry['kana']
        },

        // keb is an array of alternative forms of the current entry
        keb: function () {
            let tmpArr = [];
            if (this.kanji.length > 1) {
                for (let i = 1; i < this.kanji.length; i++) {
                    tmpArr.push(this.kanji[i]['text']);
                }
                if (this.kana.length > this.kanji.length) {
                    for (let j = this.kanji.length; j< this.kana.length; j++) {
                        tmpArr.push(this.kana[j]['text'])
                    }
                }
            }
            else if (this.kana.length > 1) {
                for (let i = 1; i < this.kana.length; i++) {
                    tmpArr.push(this.kana[i]['text'])
                }
            }
            return tmpArr;
        },

        // An array of word types (noun, verb, etc.) for each entry 
        wordTypes: function () {
            let tmpArr = [];
            if (this.entry["sense"] != null) {
                for (var types of this.entry['sense'][0]['partOfSpeech']) {
                    let tag = types.replace(";", "");
                    tmpArr.push({ type: tagDict[tag] });
                }
            }
            return tmpArr;
        },

        // The elements in wordTypes as a String
        wordTypeText: function() {
            let msg = "Word Type: "
            if (this.wordTypes != null) {
                for (let i = 0; i < this.wordTypes.length; i++) {
                    msg += this.wordTypes[i].type
                    if (i != this.wordTypes.length - 1)
                        msg += "; "
                }
            }
            return msg
        }

    },
    
    created() {
            this.getReading();
    },

    methods: {

        // Returns the reading of the current entry, with or without Kanji
        getReading() {
            let tmpReading = "";
            if (this.entry.kanji.length == 0)    // If entry reading contains no kanji
                tmpReading = this.entry['kana'][0].text;  
            else {
                try {
                    if (this.tokenizer != null) {
                        tmpReading = this.addFurigana([{'furigana': this.entry['kanji'][0].text, 'index': 0, 'tokenId': ''}]);
                    }
                }
                catch (exception) {
                    //tmpReading = "Error: Could not find reading"
                    tmpReading = exception;
                }
            }
            if (tmpReading != "") {
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

        /* Returns the card contents when creating new flashcards
        *  TODO: Add option for kanji/furigana
        */
        getNewCardContents() {
            let back = "";
            for (let i = 0; i < this.definitionSelection.length; i++) {
                back += this.definitionSelection[i];
                if (i < this.definitionSelection.length - 1)
                    back += "\n";
            }
            return {
                "front": this.getReading(),
                "back": back
            }
        },

        /* To lookup the definition of a new word.
        *  Will be used when support for 'example sentences' is added
        */
        emitGlobalGetEntry(id) {
            this.$eventHub.$emit('globalGetEntry', id)
        },

        /* Adds new flashcard with specified definition to specified decks
        */
        addCardToDeck() {
            this.newCardContents = this.getNewCardContents();
            if (this.deckSelection.length == 0) {
                this.deckSelectionError = true;
            }
            else if (this.definitionSelection.length == 0) {
                this.definitionSelectionError = true;
            }
            else {
                this.$eventHub.$emit('globalAddCardToDeck', 
                    {
                        "decks": this.deckSelection,
                        "card": this.newCardContents
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
        }
        
    },


    watch: {
        /* Updates the Dictionary contents when a new word is selected
        */
        entry: function () {
            this.getReading();
        },
    }
}
</script>

<style lang="scss" scoped>

    .dictionary-content{
        margin-left: auto;
        margin-right: auto;
        background-color: grey;
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
        background-color: darkolivegreen;
        text-align: center;
        border-radius: 10px 10px 0px 0px;
        align-items: center;
        justify-content: center;
    }

    .word-type-text {
        font-size: medium;
        opacity: 60%;
        
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

</style>
