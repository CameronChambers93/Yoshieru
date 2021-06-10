import tagConversions from '../assets/jpnToEngTags.json';

export default {
    created() {
    },
    methods: {
        getPosTag(token) {
            let tag = tagConversions[token.pos]
            if (tag == 'n' && token["pos_detail_1"] == "代名詞")
                return 'pn'
            return tag
        },
        furiganizeWord(textToAnalyze) {
            let kuroshiro = this.$store.state.analyzer.kuroshiro;
            return new Promise((resolve) => {
                kuroshiro.convert(textToAnalyze, { mode: "furigana", to: "hiragana" })
                .then(result => {
                    resolve(result); // Resolves the promise with the updated tokenList only after each token has been updated
                })
            });
        },
      tokenize(textToAnalyze) {
        let tokenizer = this.$store.state.analyzer.tokenizer
        let tokenList = []; // TokenList will contain an element for each word in the sentence to be analyzed
        let tokens = tokenizer.tokenize(textToAnalyze);
        for (let i = 0; i < tokens.length; i++) {
            let text = tokens[i]['surface_form'];  // The 'surface_form' option passed here signifies the original form used
            let tag = this.getPosTag(tokens[i])
            let ids = this.lookupWord(tokens[i]['basic_form'], tag);
            let newToken = { index: i , text, furigana: '', ids: ids};  // index is assigned here to keep the word order of the transcription
            tokenList.push(newToken);
        }
        return tokenList
      },
      furiganizeSentence(textToAnalyze) {
        let tokenList = this.tokenize(textToAnalyze);
        let count = 0;
        tokenList.sort((a, b) => a.index - b.index);    // Sorts in ascending order based on index value (Original sentence order)
        let kuroshiro = this.$store.state.analyzer.kuroshiro;
        return new Promise(resolve => {
            for (let i = 0; i < tokenList.length; i++) {
                    kuroshiro.convert(tokenList[i].text, { mode: "furigana", to: "hiragana" })
                    .then(result => {
                        count += 1;
                        tokenList[i]['furigana'] = result;  // Replaces the old transcription with the updated one
                        if (count == tokenList.length) {
                            resolve(tokenList); // Resolves the promise with the updated tokenList only after each token has been updated
                        }
                    })
                }
            });
        },
        lookupWord(word, tag=null) {
            //let idTrie = this.$store.state.dictionary.idTrie;
            //let entry = idTrie.findWord(word);
            let textTrie = this.$store.state.dictionary.textTrie;
            let ids = textTrie.findWord(word, tag);
            return ids
        },
        getWord(id) {
            let idTrie = this.$store.state.dictionary.idTrie;
            let results = idTrie.findWord(id);
            return results;
        },
        async getReading(word) {
            let reading;
            let readingWithoutFurigana
            if (!(word.k_ele) || ('ke_inf' in word['k_ele'][0] && word['k_ele'][0]['ke_inf'][0] == '&oK;')) {    // If entry reading contains no kanji
                reading = word["r_ele"][0]["reb"];  
                readingWithoutFurigana = word["r_ele"][0]["reb"];
            }
            else {
                try {
                    let result = await this.$store.dispatch('analyzer/addFurigana', word["k_ele"][0]["keb"])
                    reading = result
                    readingWithoutFurigana = word["k_ele"][0]["keb"]
                }
                catch (exception) {
                    //tmpReading = "Error: Could not find reading"
                    reading = exception;
                    readingWithoutFurigana = exception;
                }
            }
            return [reading, readingWithoutFurigana];
        }
    }
}