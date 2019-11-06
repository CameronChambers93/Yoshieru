<template lang="html">
    <div>
        <md-content class="toolbar">
            <span class="md-headline" v-html="reading"></span>
        </md-content>

        <md-content class="content md-scrollbar">
            <p class="md-headline" >Hiragana: {{ hiragana }}</p>
	        <p class="md-headline"  v-for='types in types'>Word type: {{ types }}</p>
	        <p class="md-headline"  v-for='(gloss, index) in gloss'>{{ index + 1 }}. {{ gloss }}</p>
            <div v-if='(k_ele != null) && (k_ele.length > 1)'>
                Other forms:
                <p class="md-display-1"  v-for='value in keb'>
                    {{ value }}
                </p>
            </div>
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
                kuroshiroAnalyzer: {},
                kuromojiTokenizer: {},
                reading: ""
            }
        },

        computed: {

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

            hiragana: function () {
                return this.entry["r_ele"][0]["reb"][0]
            },

            k_ele: function () {
                return this.entry["k_ele"];
            },

            keb: function () {
                let tmpArr = [];
                if (this.k_ele.length > 0) {
                    for (let i = 1; i < this.k_ele.length; i++) {
                        tmpArr.push(this.k_ele[i]["keb"][0]);
                    }
                }
                return tmpArr;
            },

            types: function () {
                let tmpArr = [];
                if (this.entry["sense"] != null) {
                    for (var types of this.entry.sense[0].pos) {
                        let tag = types.replace(";", "");
                        tmpArr.push(tagDict[tag]);
                    }
                }
                return tmpArr;
            }

        },

        methods: {
            getReading() {
                let tmpReading = "";
		        if (!this.entry.hasOwnProperty("k_ele"))
			        tmpReading = this.entry["r_ele"][0]["reb"][0];
		        else {
                    try {
                        if (this.tokenizer != null) {
				            tmpReading = this.furiganize(this.entry["k_ele"][0]["keb"][0]);
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
            furiganize(textToTranslate) {
                let tokenList = []
                let tokens = this.tokenizer.tokenize(textToTranslate);
                let count = 0;
                for (let i = 0; i < tokens.length; i++) {
                    axios.get('http://localhost:3000/api/lookups/?k_ele=' + tokens[i]['basic_form'])
                        .then(response => {
                            let kanji = tokens[i]['surface_form']
                            let tokenId = (response.data.id) ? response.data.id : '';
                            let newToken = { furigana: kanji, index: i, id: tokenId }
                            tokenList.push(newToken)
                            count += 1;
                            if (count == tokens.length) {
                                return this.processFurigana(tokenList)
                            }

                        })
                        .catch(error => {
                            console.log('-----error-------');
                            console.log(error)
                        })
                }
            },
            processFurigana(tokenList) {
                tokenList.sort((a, b) => a.index - b.index);
                let count = 0;
                for (let i = 0; i < tokenList.length; i++) {
                    var promise = new Promise((resolve, reject) => {
                        async function furiganize(kuroshiro, kana, index) {
                            var result = await kuroshiro.convert(kana, { mode: "furigana", to: "hiragana" });;
                            count += 1;
                            let response = [result, kana, index]
                            resolve(response)
                        }
                        furiganize(this.kuroshiro, tokenList[i]['furigana'], i);
                    });

                    promise.then((result) => {
                        tokenList[result[2]]['furigana'] = result[0]
                        if (count == tokenList.length) {
                            let msg = ""
                            for (var token of tokenList) {
                                msg += token.furigana + "\n"
                            }
                            this.reading = msg
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
