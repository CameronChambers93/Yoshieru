<template lang="html">
    <div>
        <md-content class="toolbar">
            <span class="md-headline" v-html="reading"></span>
        </md-content>

        <md-content class="content md-scrollbar">
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

            <div v-if='keb.length != 0' style="display: flex; padding-top: .3em" class="md-headline">
                <div>
                    Other forms:
                </div>
                <div style="display: block; padding-left: .3em">
                    <div class="md-display-1"  v-for='value in keb'>
                        {{ value }}
                    </div>
                </div>
            </div>
	        <p class="md-headline"  v-for='types in types'>Word type: {{ types }}</p>
            <span class="md-display-1">Definitions:</span>
	        <p class="md-headline"  v-for='(gloss, index) in gloss'>{{ index + 1 }}. {{ gloss }}</p>
            <md-button class="md-raised md-primary" v-on:click="$emit('getPreviousEntry')"><- {{ previousEntry }}</md-button>
        </md-content>
    </div>
</template>

<script>
    import axios from 'axios';
    import tagDict from './../assets/tagDict.json';

    export default {
        props: {
            id: {
                default: 137410,
                type: Number
            },
            entry: {
                default: () => {
                    return {
                         
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
            }

        },
               

        metaInfo() {
            return { 
                title: this.post && this.post.title,
            };
        },

        data() {
            return {
                post: {"id":"1562350","kanji":[{"common":true,"text":"話す","tags":[]},{"common":false,"text":"咄す","tags":[]}],"kana":[{"common":true,"text":"はなす","tags":[],"appliesToKanji":["*"]}],"sense":[{"partOfSpeech":["v5s","vt"],"appliesToKanji":["*"],"appliesToKana":["*"],"related":[],"antonym":[],"field":[],"dialect":[],"misc":[],"info":[],"languageSource":[],"gloss":[{"type":null,"lang":"eng","text":"to talk"},{"type":null,"lang":"eng","text":"to speak"},{"type":null,"lang":"eng","text":"to converse"},{"type":null,"lang":"eng","text":"to chat"}]},{"partOfSpeech":["v5s","vt"],"appliesToKanji":["*"],"appliesToKana":["*"],"related":[],"antonym":[],"field":[],"dialect":[],"misc":[],"info":[],"languageSource":[],"gloss":[{"type":null,"lang":"eng","text":"to tell"},{"type":null,"lang":"eng","text":"to explain"},{"type":null,"lang":"eng","text":"to narrate"},{"type":null,"lang":"eng","text":"to mention"},{"type":null,"lang":"eng","text":"to describe"},{"type":null,"lang":"eng","text":"to discuss"}]},{"partOfSpeech":["v5s","vt"],"appliesToKanji":["*"],"appliesToKana":["*"],"related":[],"antonym":[],"field":[],"dialect":[],"misc":[],"info":[],"languageSource":[],"gloss":[{"type":null,"lang":"eng","text":"to speak (a language)"}]}]},
                reading: ""
            }
        },

        computed: {

            // Gloss is an array containing 1 or more definitions for each entry
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

            // The reading of the entry without any Kanji
            hiragana: function () {
                if (this.kanji.length == 0) {
                    return ""
                }
                else return this.kana[0]['text']
            },

            // The reading of the entry with Kanji (If no Kanji is present, k_ele is equivalent to this.hiragana)
            kanji: function () {
                return this.entry["kanji"];
            },
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
                console.log(tmpArr)
                console.log(this.kana)
                return tmpArr;
            },

            // Types is an array of word types (noun, verb, etc.) for each entry 
            types: function () {
                let tmpArr = [];
                if (this.entry["sense"] != null) {
                    for (var types of this.entry['sense'][0]['partOfSpeech']) {
                        let tag = types.replace(";", "");
                        tmpArr.push(tagDict[tag]);
                    }
                }
                return tmpArr;
            }

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
				            tmpReading = this.tokenizeThenFuriganize(this.entry['kanji'][0].text);
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
                    axios.get('http://ec2-3-129-62-182.us-east-2.compute.amazonaws.com:3000/api/lookups/?k_ele=' + tokens[i]['basic_form'])
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
            }
        },
    
        created() {

            this.getReading()

        },

        watch: {
            entry: function () {
                this.getReading();
            }
        }
    }
</script>

<style lang="scss" scoped>

    .content{
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
        height: 80px;
        background-color: darkolivegreen;
        padding: 20px 0px 20px 0px;
        text-align: center;
        border-radius: 10px 10px 0px 0px;
    }

</style>
