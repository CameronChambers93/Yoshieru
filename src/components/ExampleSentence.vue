<template>
    <div>
        <div>
            <furigana-component
                v-bind:tokens="tokenList"
                class="furigana-component"
                :_style="sentenceStyle"
                />
        </div>
        <div style="margin: 0 0 1em 0">
            {{eng}}
        </div>
    </div>
</template>
<script>
import FuriganaComponent from './FuriganaComponent.vue';
import tagConversions from './../assets/jpnToEngTags.json';
export default {
    components: {
        'furigana-component': FuriganaComponent
    },
    data() {
        return {
            tokenList: [],
            sentenceStyle: {
                color: 'white',
                'font-size': '1.6em'
            }
        }
    },
    created() {
        this.tokenizeThenFuriganize();
    },
    props: {
        jpn: {
            default: '',
            type: String
        },
        eng: {
            default: '',
            type: String
        }
    },
    methods: {
        tokenizeThenFuriganize: function () {
                let tokenList = []; // TokenList will contain an element for each word in the sentence to be analyzed
                let tokenizer = this.$store.state.analyzer.tokenizer;
                let textToAnalyze = this.jpn
                let tokens = tokenizer.tokenize(textToAnalyze);    // Breaks the transcription up into an array of words
                let textTrie = this.$store.state.dictionary.textTrie;
                let count = 0;
                for (let i = 0; i < tokens.length; i++) {
                    let text = tokens[i]['surface_form'];  // The 'surface_form' option passed here signifies the original form used
                    let tag = tagConversions[tokens[i].pos]
                    let ids = textTrie.findWord(tokens[i]['basic_form'], tag);
                    let newToken = { index: i , text, furigana: '', ids: ids};  // index is assigned here to keep the word order of the transcription
                    tokenList.push(newToken);
                    count += 1;
                    if (count == tokens.length) {   // When every token has been processed
                        this.addFurigana(tokenList);    // Call second function to complete the process
                    }
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
            let kuroshiro = this.$store.state.analyzer.kuroshiro;
            for (let i = 0; i < tokenList.length; i++) {
                var promise = new Promise((resolve) => {
                    async function furiganize(kuroshiro, kana, index) {
                        let result = await kuroshiro.convert(kana, { mode: "furigana", to: "hiragana" });
                        count += 1;
                        tokenList[index]['furigana'] = result;  // Replaces the old transcription with the updated one
                        if (count == tokenList.length) {
                            resolve(tokenList); // Resolves the promise with the updated tokenList only after each token has been updated
                        }
                    }
                    furiganize(kuroshiro, tokenList[i]['text'], i); // Asynchronous call to process each token
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
<style scoped>

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