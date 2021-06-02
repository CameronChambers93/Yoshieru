<template>
    <div style="display: flex; flex-wrap: wrap; justify-content: center">
        <div v-if="isInputShown == false" class="answer-content">
            <span class="md-body-1" style="margin: .5rem 0 .5rem 0; width: 100%; font-size: 1.2rem">Your answer: {{ guess }}</span>
            <furigana-component :parent='"AUDIO"' v-bind:tokens="tokenList" class="furigana-component"></furigana-component>
            <span class="md-headline" style="width: 100%; text-align: center; margin-bottom: 20px;">{{ audioEnglish }}</span>
            <md-button class="md-raised md-primary" v-on:click="nextQuestion()">Next</md-button>
        </div>

        <div v-else style="display: flex; flex-wrap: wrap; justify-content: center; width: 80%;">
            <furigana-component :parent='"AUDIO"' v-bind:tokens="tokenList" class="furigana-component"></furigana-component>
            <md-field>
                <form @submit.prevent="submitAnswer()">
                    <md-input style="-webkit-text-fill-color: black;" v-model="guess" placeholder="Enter your answer"></md-input>
                </form>
            </md-field>
        </div>
    </div>
</template>

<script>
import FuriganaComponent from './FuriganaComponent.vue';
import Mixins from '../mixins/Mixins'
import { mapState, mapGetters } from 'vuex';
export default {
    components: {
        'furigana-component': FuriganaComponent
    },
    mixins: [Mixins],
    props: {
    },
    data() {
        return {  
            tokenList: [],
            guess: "",   // The user's latest guess,
            isInputShown: true,
            clozeIndex: 0,
            answer: {}
        }
    },
    methods: {
        submitAnswer() {
            let color = (this.guess == this.tokenList[this.clozeIndex].text) ? 'green' : 'red';
            this.tokenList[this.clozeIndex] = Object.assign({}, {...this.answer, style: `color: ${color}; font-size: 30px; line-height: 36px`})
            this.tokenList = [...this.tokenList];   //  Needed for answer color reactivity
            this.isInputShown = false;
        },
        nextQuestion() {
            this.$store.dispatch('audio/getAudio')
        },
        getSentenceCloze(tokenList) {
            this.clozeIndex = Math.floor(Math.random() * tokenList.length);
            this.answer = Object.assign({}, tokenList[this.clozeIndex])
            tokenList[this.clozeIndex].id = '';
            tokenList[this.clozeIndex].furigana = '_____';
        }
    },
    computed: {
        ...mapState({
            computedFilepath: state => state.audio.computedFilepath,
            audioComponentCounter: state => state.audio.audioComponentCounter
        }),
        ...mapGetters('audio', {
            audioEnglish: 'audioEnglish',
            audioKana: 'audioKana',
            audioAuthor: 'audioAuthor',
            licenseType: 'licenseType',
            licenseLink: 'licenseLink'
        })
    },
    created() {
      console.log(this.tokenize(this.audioKana))
      this.furiganizeSentence(this.audioKana)
      .then(result => {
          this.tokenList = result;
          this.getSentenceCloze(result);
      })
    },
    watch: {
        audioKana: function(newVal) {
            this.furiganizeSentence(newVal)
            .then(result => {
                this.tokenList = result;
                this.getSentenceCloze(result);
            })
            this.isInputShown = true;
            this.guess = "";
        }
    }
}

</script>

<style lang="scss" scoped>


    form{
         min-width: 100% !important
    }

    .audio-player {
        margin: 20px auto 30px auto
    }

    .answer-content {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
</style>
