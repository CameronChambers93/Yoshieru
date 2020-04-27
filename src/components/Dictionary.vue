<template lang="html">
    <div>
        <md-content class="toolbar">
            <span class="toolbar-text md-display-1" v-html="reading"></span>
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



        <md-content class="dictionary-content md-scrollbar">
            <div style="margin-top:.75em;" class="md-headline" >Hiragana: {{ hiragana }}</div>

            <div style="display:block; margin-top:.25em">
	            <div class="word-type-text md-headline" v-html="wordTypeText"></div>
            </div>

            <div style="margin: .25em 0 .25em 0;" class="md-display-1">Definitions:</div>
            
	        <div style="display:flex; opacity:60%; margin-bottom:.25em;" class="md-headline"  v-for='(gloss, index) in gloss' :key='index'>
                {{ index + 1 }}.  <div style="margin-left:.25em;">{{ gloss }}</div>
            </div>

            <div style="margin-top:1em" v-if='(k_ele != null) && (k_ele.length > 1)'>
                Other forms:
                <div>
                    <div style="padding-top:.25em; opacity:60%;" class="md-display-1"  v-for='value in keb'>
                        {{ value }}
                    </div>
                </div>
            </div>

            <md-button style="margin-top:1em;" class="md-raised md-primary" v-on:click="$emit('getPreviousEntry')"><- {{ previousEntry }}</md-button>
            <md-button style="margin-top:1em; float: right;" class="to-deck-btn md-raised md-primary" v-on:click="atAddDialog = true">Add card to deck</md-button>
        </md-content>
    </div>
</template>

<script>
    import axios from 'axios';
    import tagDict from './../assets/tagDict.json';

    export default {
        props: {
            entry: {
                default: () => {
                    return {
                         ent_seq: ["1562350"], k_ele: [{ keb: ["話す"], ke_pri: ["ichi1", "news1", "nf21"] }, { keb: ["咄す"] }], r_ele: [{ reb: ["はなす"], re_pri: ["ichi1", "news1", "nf21"] }], sense: [{ "pos": ["v5s", "vt"], gloss: ["to talk", "to speak", "to converse", "to chat"] }, { gloss: ["to tell", "to explain", "to narrate", "to mention", "to describe", "to discuss"] }, { gloss: ["to speak (a language)"] }]
                    }
                },
                type: Object
            },
            previousEntry: {
                default: "",
                type: String
            },
            tokenizer: {
                default: () => {
                    return null
                },
                type: Object
            },
            kuroshiro: {
                default: () => {
                    return null
                },
                type: Object
            },
            flashcardDeckNames: {
                default: () => {
                    return []
                },
                type: Array
            }

        },
               

        metaInfo() {
            return { 
                title: this.post && this.post.title,
            };
        },

        data() {
            return {
                post: {},
                reading: "",
                atAddDialog: false,
                deckSelection: [],
                deckSelectionError: false,
                definitionSelectionError: false,
                definitionSelection: [],
            }
        },

        computed: {
            
            id: () => {
                if (this.entry == null)
                    return null
                else
                    return this.entry.id
            },

            // Gloss is an array containing 1 or more definitions for each entry
            gloss: function () {
                let tmpArr = [];
                if (this.entry["sense"] != null)
                    for (var sense of this.entry.sense) {
                        let msg = "";
                        for (let i = 0; i < sense.gloss.length; i++) {
                            msg += sense.gloss[i] + ((i < sense.gloss.length - 1) ? '; ' : '');
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

            // keb is an array of alternative forms of the current entry
            keb: function () {
                let tmpArr = [];
                if (this.k_ele.length > 0) {
                    for (let i = 1; i < this.k_ele.length; i++) {
                        tmpArr.push(this.k_ele[i]["keb"][0]);
                    }
                }
                return tmpArr;
            },

            // Types is an array of word types (noun, verb, etc.) for each entry 
            wordTypes: function () {
                let tmpArr = [];
                if (this.entry["sense"] != null) {
                    for (var types of this.entry.sense[0].pos) {
                        let tag = types.replace(";", "");
                        tmpArr.push({ type: tagDict[tag] });
                    }
                }
                return tmpArr;
            },

            wordTypeText: function() {
                let msg = ""
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

        methods: {

            // Returns the reading of the current entry, with or without Kanji
            getReading() {
                let tmpReading = "";
		        if (!this.entry.hasOwnProperty("k_ele"))    // If entry reading contains no kanji
			        tmpReading = this.entry["r_ele"][0]["reb"][0];  
		        else {
                    try {
                        if (this.tokenizer != null) {
				            tmpReading = this.tokenizeThenFuriganize(this.entry["k_ele"][0]["keb"][0]);
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

            /* First step to processing the audioKanji transcription.
             *
             * Currently done in two steps due to the asynchronous nature of the process
             */
            tokenizeThenFuriganize(textToTranslate) {
                let tokenList = []; // TokenList will contain an element for each word in the sentence to be analyzed
                let tokens = this.tokenizer.tokenize(textToTranslate);    // Breaks the transcription up into an array of words
                let count = 0;
                for (let i = 0; i < tokens.length; i++) {


                    /* This API call returns the following response for each of the word tokens:
                     *      id: ID of the word
                     *      ent_seq: ent_seq of the word
                     *      k_ele: k_ele of the word
                     *      word_type: word type (noun, verb, etc.)
                     *      createdAt: Arbitrary value
                     *      updatedAt:Arbitrary value
                     */
                    axios.get('http://ec2-18-216-100-58.us-east-2.compute.amazonaws.com:3000/api/lookups/?k_ele=' + tokens[i]['basic_form'])
                        .then(response => {
                            
                            let kanji = tokens[i]['surface_form'];  // The 'surface_form' option passed here signifies the original form used
                            let tokenId = (response.data.id) ? response.data.id : '';   // Assign ID if match is found in the Lookup database
                            this.$emit('updateLookups', { kanji: tokenId } );   // 'Cache' the result
                            let newToken = { furigana: kanji, index: i, id: tokenId };  // index is assigned here to keep the word order of the transcription
                            tokenList.push(newToken);
                            count += 1;

                            if (count == tokens.length) {
                                this.addFurigana(tokenList);
                            }

                        })
                        .catch(error => {
                            console.log('-----error-------');
                            console.log(error);
                        });
                }
            },

            /*  Processes the audioKanji transcription, adding furigana and links to corresponding entries.
             *  tokenList has the current configuration:
             *      furigana: Text to which we will be adding furigana
             *      index: Used to sort the array to preserve word order
             *      id: Corresponding ID of the word in the Lookup/Entry tables, if it exists
             */
            addFurigana(tokenList) {
                tokenList.sort((a, b) => a.index - b.index);    // Sorts in ascending order based on index value (Original sentence order)
                let count = 0;
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

            // TODO: Add option for kanji/furigana
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

            emitGlobalGetEntry(id) {
                this.$eventHub.$emit('globalGetEntry', id)
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

            closeDialog() {
                this.deckSelectionError = false;
                this.atAddDialog = false;
            }
            
        },
    
        created() {
            this.$eventHub.$emit('globalGetEntry', 1562350)

        },

        watch: {
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
