<template lang="html">
    <div class="content" style="flex-wrap:wrap">
        <md-content class="toolbar">
            <md-icon>hearing</md-icon>
        </md-content>

        <md-content class="main-content">
            <div class="md-headline">Transcribe the audio clip</div>
            <audio-player class="audio-player" v-bind:filepath="computedFilepath" :key="audioComponentCounter"></audio-player>
            <div style="display: flex; width: 100%; justify-content: center; margin-top: -2em">
                <a v-bind:href="licenseLink" target="_blank">{{ licenseType }}: {{ audioAuthor }}</a>
            </div>
            <div v-if="isInputShown == false" class="answer-content">
                <span class="md-body-1" style="margin-bottom: 20px; width: 100%;">Your answer: {{ guess }}</span>
                <furigana-component v-bind:tokens="tokenList" class="furigana-component"></furigana-component>
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
import AudioPlayer from './AudioPlayer.vue'
import axios from 'axios';
import tagConversions from './../assets/jpnToEngTags.json';
import FuriganaComponent from './FuriganaComponent.vue';

    export default {
        components: {
            'audio-player': AudioPlayer, 'furigana-component': FuriganaComponent
        },
        props: {
            filename: {
                default: '',
                type: String
            },
            lookupsDict: {
                default: null,
                type: Object
            }
        },
        created () {
            /*
            this.tokenizer = this.$store.state.analyzer.tokenizer;
            this.kuroshiro = this.$store.state.analyzer.kuroshiro;
            this.idTrie = this.$store.state.dictionary.idTrie;
            this.textTrie = this.$store.state.dictionary.textTrie;
            */
            this.submitAnswer();
            this.getAudio();
            /*
            let pos = new Set();
            for (const sentence of this.test) {
                for (const token of this.tokenizer.tokenize(sentence)) {
                    if (token.pos == '接続詞22')
                        console.log(token)
                    pos.add(token.pos)
                }
            }
            */
            this.tokenizeThenFuriganize();
        },

        data() {
            return {
                endpoint: 'http://ec2-100-25-211-104.compute-1.amazonaws.com:5000/api',
                audio: {audioEnglish: "The meeting will end at 4 o'clock.", audioKana: "かいぎ は 4 とき に おわります", audioKanji: "会議は4時に終わります", createdAt: "2019-08-03T14:00:04.000Z", filename: "e21548c3fc117238b1594acfecf28fb4.mp3", id: 75, updatedAt: "2019-08-03T14:00:04.000Z"},
                computedFilepath: 'http://ec2-100-25-211-104.compute-1.amazonaws.com:5000/api/audio/13cc999f59e4b379f17239fca629bf2f.mp3',
                audioComponentCounter: 0,   // Used to refresh the furigana-component in order to refresh the audio file
                tokenList: [],  // Array containing transcription of current audio file, with furigana and links to corresponding entries. Passed to furigana-component
                isInputShown: true, // Used to flip between question and answer
                guess: "",   // The user's latest guess,
                test: ['それはとってもいい話だ', '私は絵を見るのが好きです', 'そこに大きな円を描いて', '京都にはお寺が多い', '家に遊びに来てください', 'これをください', '私が行きましょう', '3月は仕事が忙しい', 'テストを始めてください', '彼は医者になりました', '今朝は早く家を出ました', 'このパソコンを使ってください', '私は友達のところに泊まった', '私もそう思います', '私は車を持っています', '今は時間がありません', '今年はイタリアに旅行したい', '誰もその話を知らない', '今、朝ご飯を作っています', '彼の日本語のレベルは私と同じ位だ', '彼は今、勉強しています', '工事は3月まで続きます', '一緒に宿題をやろう', '上司が「一杯、飲もう」と言った', '今年は雨が少ないです', '帰国することに決めました', 'これがこの町で一番高いビルです', 'よく考えてください', '膝に痛みを感じます', '電車で子供が騒いでいた', '私もそう思います', '彼はもう帰りました', '駅の近くで食事をした', '彼はかばんに手帳を入れた', '彼は真面目な学生です', '明日の午後、お客様が来る', '彼女の髪はとても長い', '本を１冊買いました', '彼女はよく旅行に行きます', '彼女はOLです', '彼女はラジオを聞いています', 'あなたはどう思いますか', '皆一生懸命生きている', '彼はタオルで顔を拭きました', 'あの本をどこに置きましたか', 'それを一つください', 'この本、あなたにあげます', 'こう小さい字は読めない', '学校は8時半に始まります', '友達が誕生日プレゼントをくれた', '私は毎朝6時に起きます', '今年の春は暖かいね', '午前9時のニュースです', '郵便局で切手を買いました', '宿題は未だ終わっていません', '会議は4時に終わります', '彼はまだ若いです', '彼はかなり英語が上手です', '彼はかばんをいすの上に置きました', '彼は会社の近くに住んでいる', '今、会社に戻ります', '仕事の後、映画を見た', '私は日本語の先生になりたいです', '彼はステージに立った', '彼は意外に気が小さい', 'ウェイターを呼びましょう', 'もっと近くに来てください', '大学に行ってもっと勉強したいです', '家に帰ろう', '彼の気持ちが分からない', '鳥が飛んでいます', '彼の車は新しい', '弟が車を買った', '旅行の日程を変えました', '彼の家はとても広い', 'この言葉の意味が分かりません', 'グラスの数が足りません', '彼は毎晩3キロ走っています', '彼は家を売った', '気持ちのいい朝です', '彼は数学を教えています', '駅まで歩きましょう', '直ぐ行きます', 'また会いましょう', '私の部屋は2階にあります', '町で大事件が起こりました', 'この本は難しいですね', '彼の家に荷物を送りました', '駅からはタクシーに乗ってください', 'この服はとても安かった', '彼に手紙を書きました', '母と電話で話しました', '今朝から頭が痛い', '私は体が丈夫だ', '駅はここから近いです', 'ここに本があります', 'あなたが来るのを待っています', '彼は背が低い', '彼女からプレゼントをもらいました', '昨日タイカレーを食べました', 'まだ学校へ行くには早い時間です', '兄は水泳が得意です', 'あなたの名前を教えてください', '私の夫はサラリーマンです', '一から始めましょう', '彼女は秋に結婚します', '彼女は来月結婚します', '親の愛は有り難い', '私は古い車が好きです', 'この絵は美しいです', '彼は足が長い', '明日、6時に起こしてください', '別の本も見せてください', 'その写真を見せてください', '私の娘はアメリカにいます', 'この本はとてもおもしろい', '私の国について少しお話しましょう', '少し疲れました', '質問の意味は分かりましたか', '質問のある方はどうぞ', 'すてきな色のセーターですね', 'みんなにお菓子をあげましょう', 'テストでいい点を取った', '私は日本語を勉強しています', '彼女はイタリア語が出来ます', '彼は足が短い', '猿も木から落ちる', 'うちの息子は大学1年生です', '彼は歯が白い', '誰と会ってみたいですか', '息子は飛行機のおもちゃが好きです', '今日はヤンキースが勝った', '祖父が病気になった', '犬が病気で死にました', 'カナダの冬はとても寒いです', '新しい年が始まりました', 'このかばんは重いです', '胸に少し痛みがあります', '彼女は雑誌を読んでいます', '私が払いましょう', 'この靴はとても軽い', '新しい仕事を見つけました', '次はいつ会いましょうか', '彼女はいつ来ますか', '私には友達がたくさんいます', '約束を忘れないでください', '彼女は酒に強い', '肉と魚とどちらが好きですか', '姉は銀行で働いています', '姉は大学生です', '妹は平仮名を全部覚えました', '私の部屋は狭いです', '私はワインが好きです', '私たちは来年、家を建てます', 'この中でどれが好きですか', '赤いバラを買いました', '今日は一人の時間を楽しみたい', '今日は仕事がありません', '今日はスーツを着ています', '赤ん坊が笑っています', '彼はクラスで一番背が高い', '今日は日本語の授業があります', 'その次の週は空いてますか', '漢字は中国から来ました', '毎日、駅まで自転車で行きます', '私は電車で通学しています', '彼は郵便局を探していました', '紙と鉛筆はありますか', '私たちは大きな声で歌いました', '前の車はとても遅い', 'きりんの首は長い', '彼は走るのが速い', '一緒に帰りましょう', '友達と一緒に宿題をした', '私は毎日、日記を付けています', '今月はとても忙しい', '子供たちが公園で遊んでいる', '家から学校までは遠いです', 'その子は体が少し弱い', '彼女は耳がよく聞こえません', 'そこに座ってください', '私は窓側の席に座った', '右のポケットにハンカチが入っています', '私は朝、シャワーを浴びます', '肩が凝りました', '友達とお酒を飲んでいます', 'もう寝よう', '昼間は電気を消してください', '彼女はいつも元気だ', 'おかげさまで元気です', '私たちのチームはその試合で負けた', 'それ、全部ください', '私は去年フランスへ行った', 'このドアは引いてください', '日曜日は図書館に行きます', '図書館で料理の本を借りた', '彼は荷物をあみだなに上げた', 'この町には緑がたくさんあります', '彼の腕は太い', 'ドアを開けてください'],
            }
        },

        computed: {
            audioEnglish: function () {
                if (this.audio.audioEnglish != null)
                    return this.audio.audioEnglish
                else
                    return ''
            },
            audioKana: function () {
                if (this.audio.audioKana != null)
                    return this.audio.audioKana
                else
                    return ''
            },
            audioAuthor: function() {
                if (this.audio.author != null) {
                    return this.audio.author
                }
                else return ''
            },
            licenseType: function() {
                if (this.audio.license_type != null) {
                    if (this.audio.license_type != '\\N') {
                        return this.audio.license_type
                    }
                    else {
                        return 'CC'
                    }
                }
                else return '';
            },
            licenseLink: function() {
                const default_link_base = 'https://tatoeba.org/eng/user/profile/'
                if (this.audio.license_link != null) {
                    if (this.audio.license_link == '\\N') {
                        return default_link_base + this.audio.author
                    }
                    else {
                        return this.audio.license_link
                    }
                }
                else return '';
            }
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
            *       jpn_id: ID of Japanese text in Tatoeba's jpn_sentences
            *       eng_id: ID of English text in Tatoeba's eng_sentences
            *       jpn_text: Japanese text
            *       eng_text: English text
            *       author: Name of voice actor for audio clip
            *       license_type: Type of licensing (needed to credit authors)
            *       license_link: Link to be included with author recognition
             */
            getAudio() {
                this.isInputShown = true;
                this.guess = "";
                
                axios(`${this.endpoint}/randomAudio/`)
                    .then(response => {
                        console.log(response.data)
                        this.audio = response.data;
                        this.computedFilepath = "https://audio.tatoeba.org/sentences/jpn/" + response.data["jpn_id"] + '.mp3';  // This API call returns an audio stream of the specified file to be used by the mediaserver library
                        this.tokenizeThenFuriganize();
                        //this.computedFilepath = `${this.endpoint}/audio/${response.data["filename"]}`;
                        console.log(response.data)
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
            tokenizeThenFuriganize: function () {
                let tokenList = []; // TokenList will contain an element for each word in the sentence to be analyzed
                let tokenizer = this.$store.state.analyzer.tokenizer;
                let textToAnalyze = this.audio['jpn_text']
                console.log(textToAnalyze)
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
        background-color: grey !important;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .content{
        margin-left: auto;
        margin-right: auto;
        background-color: grey !important;
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

    .audio-player {
        margin: 20px auto 30px auto
    }
</style>
