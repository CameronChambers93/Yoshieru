<template lang="html">
    <div class="content" style="flex-wrap:wrap">

        <md-content class="toolbar">
            <i style='font-size:24px' class='fas'>&#xf2a2;</i>
        </md-content>

        <md-content class="main-content">
            <div class="md-headline">Transcribe the audio clip</div>
            <audio-player class="audio-player" v-bind:filepath="computedFilepath" :key="audioComponentCounter"></audio-player>

            <div v-if="isInputShown == false" class="answer-content">
                <span class="md-body-1" style="margin-bottom: 20px; width: 100%;">Your answer: {{ guess }}</span>
                <furigana-component v-bind:html="tokenList" class="furigana-component"></furigana-component>
                <span class="md-headline" style="width: 100%; text-align: center; margin-bottom: 20px;">{{ audioEnglish }}</span>
                <md-button class="md-raised md-primary" v-on:click="getAudio()">Next</md-button>
            </div>

            <div v-else>
                <md-field>
                    <form @submit.prevent="submitAnswer">
                        <md-input v-model="guess" placeholder="Enter your answer"></md-input>
                    </form>
                </md-field>
            </div>
        </md-content>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        props: {
            filename: {
                default: '',
                type: String
            },
            tokenizer: {
                default: null,
                type: Object
            },
            kuroshiro: {
                default: null,
                type: Object
            },
            lookupsDict: {
                default: null,
                type: Object
            }
        },

        created () {
            this.tokenize()
        },

        data() {
            return {
                endpoint: 'http://ec2-3-129-62-182.us-east-2.compute.amazonaws.com:3000/api/audio/',
                audio: {audioEnglish: "The meeting will end at 4 o'clock.", audioKana: "かいぎ は 4 とき に おわります", audioKanji: "会議は4時に終わります", createdAt: "2019-08-03T14:00:04.000Z", filename: "e21548c3fc117238b1594acfecf28fb4.mp3", id: 75, updatedAt: "2019-08-03T14:00:04.000Z"},
                computedFilepath: 'http://ec2-3-129-62-182.us-east-2.compute.amazonaws.com:3000/api/audio/13cc999f59e4b379f17239fca629bf2f.mp3',
                audioComponentCounter: 0,   // Used to refresh the furigana-component in order to refresh the audio file
                tokenList: [],  // Array containing transcription of current audio file, with furigana and links to corresponding entries. Passed to furigana-component
                isInputShown: true, // Used to flip between question and answer
                guess: "",   // The user's latest guess,
                posDict: {'名詞': 'n', '助詞': 'prt', '形容詞': 'adj', "動詞": 'v', '連体詞': 'adj'}
            }
        },

        computed: {
            audioEnglish: function () {                 // English transcription of the current audio sample
                if (this.audio.audioEnglish != null)
                    return this.audio.audioEnglish
            },
            audioKana: function () {                    // Japanese transcription of the current audio sample
                if (this.audio.audioKana != null)
                    return this.audio.audioKana
            }
        },


        watch: {
        },

        methods: {

            /*  Reveals the answer
             *  
             *  User's answer is bound to this.guess
             */
            submitAnswer() {
                this.isInputShown = false;
            },


            /*  The randomAudio API call returns an object with the following structure:
             *      filename: filename of the audio file on the API server
             *      audioKanji: Text transcription of the audio file
             *      audioKana: Text transcription of the audio file without kanji
             *      audioEnglish: English translation of audioKanji/audioKana
             */
            getAudio() {
                this.isInputShown = true;
                this.guess = "";
                axios('http://ec2-3-129-62-182.us-east-2.compute.amazonaws.com:3000/api/randomAudio/')
                    .then(response => {
                        this.audio = response.data;
                        this.tokenize();
                        this.computedFilepath = "http://ec2-3-129-62-182.us-east-2.compute.amazonaws.com:3000/api/audio/" + response.data["filename"];  // This API call returns an audio stream of the specified file to be used by the mediaserver library
                        this.audioComponentCounter += 1;    // Refresh the furigana-component

                    })
                    .catch(error => {
                        console.log('---error---');
                        console.log(error);
                    })
            },
            
            /* First step to processing the audioKanji transcription.
             *
             * Currently done in two steps due to the asynchronous nature of the process
             */
            tokenize: function () {
                let tokenList = []; // TokenList will contain an element for each word in the sentence to be analyzed
                let tokens = this.tokenizer.tokenize(this.audio.audioKanji);    // Breaks the transcription up into an array of words
                let count = 0;
                for (let i = 0; i < tokens.length; i++) {

                    if (this.lookupsDict.hasOwnProperty([tokens[i]['basic_form'], this.posDict[tokens[i].pos]])) {    // To be used for 'caching'
                        console.log('')
                    }

                    /* This API call returns the ID of the word (if found) corresponding to 'k_ele' with 'pos' as its word type
                     */
                    axios.get('http://ec2-3-129-62-182.us-east-2.compute.amazonaws.com:3000/api/lookups/?k_ele=' + tokens[i]['basic_form'] + '&pos=' + this.posDict[tokens[i].pos])    // The 'basic_form' option passed here signifies the dictionary form of the given word
                        .then(response => {
                            let kanji = tokens[i]['surface_form'];  // The 'surface_form' option passed here signifies the original form used
                            let tokenId = (response.data) ? response.data : '';   // tokenId is used to create the Dictionary links
                            this.$emit('updateLookups', { kanji: tokenId } );   // 'Cache' the result
                            let newToken = { furigana: kanji, index: i, id: tokenId };  // index is assigned here to keep the word order of the transcription
                            tokenList.push(newToken);
                            count += 1;
                            if (count == tokens.length) {   // When every token has been processed
                                this.addFurigana(tokenList);    // Call second function to complete the process
                            }

                        })
                        .catch( error => {
                            console.log('-----error-------');
                            console.log(error);
                        })
                }
                
            },

            /*  Processes the audioKanji transcription, adding furigana and links to corresponding entries.
             *  tokenList has the current configuration:
             *      furigana: Text to which we will be adding furigana
             *      index: Used to sort the array to preserve word order
             *      id: Corresponding ID of the word in the Lookup/Entry tables, if it exists
             */
            addFurigana(tokenList) {
                let count = 0;
                tokenList.sort((a, b) => a.index - b.index);    // Sorts in ascending order based on index value (Original sentence order)
                for (let i = 0; i < tokenList.length; i++) {
                    var promise = new Promise((resolve, reject) => {
                        async function furiganize(kuroshiro, kana, index) {
                            let result = await kuroshiro.convert(kana, { mode: "furigana", to: "hiragana" });
                            count += 1;
                            tokenList[index]['furigana'] = result;  // Replaces the old transcription with the updated one
                            if (count == tokenList.length) {
                                resolve(tokenList); // Resolves the promise with the updated tokenList only after each token has been updated
                            }
                        }
                        furiganize(this.kuroshiro, tokenList[i]['furigana'], i); // Asynchronous call to process each token
                    });

                    promise.then((result) => {
                        this.tokenList = result; // Assign the updated tokenList after the promise has resolved
                    }, (err) => {
                            console.log(err);
                    });
                }
            }
        }
    }
</script>

<style lang="scss" scoped>  

    .furigana-component {
        font-size:24px;
        margin-bottom: 10px;
        width: 100%;
        text-align: center;
    }

    .answer-content {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .main-content {
        padding: 20px 20px 20px 20px;
        background-color: grey;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .content{
        margin-left: auto;
        margin-right: auto;
        background-color: grey;
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

    .audio-player {
        margin: 20px auto 30px auto
    }
</style>
