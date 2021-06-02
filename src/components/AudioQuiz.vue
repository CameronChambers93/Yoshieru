<template>
    <div>
        <div v-if='questionType == "cloze"'>
            <div class="md-headline">Fill in the blank</div>
            <audio-player class="audio-player" v-bind:filepath="computedFilepath" :key="audioComponentCounter"></audio-player>
            <div style="display: flex; width: 100%; justify-content: center; margin-top: -2em">
                <a v-bind:href="licenseLink" target="_blank">{{ licenseType }}: {{ audioAuthor }}</a>
            </div>
            <ClozeQuiz />
        </div>
        <div v-else>
            <div class="md-headline">Transcribe the audio clip</div>
            <audio-player class="audio-player" v-bind:filepath="computedFilepath" :key="audioComponentCounter"></audio-player>
            <div style="display: flex; width: 100%; justify-content: center; margin-top: -2em">
                <a v-bind:href="licenseLink" target="_blank">{{ licenseType }}: {{ audioAuthor }}</a>
            </div>
            <div v-if="isInputShown == false" class="answer-content">
                <span class="md-body-1" style="margin-bottom: 20px; width: 100%;">Your answer: {{ guess }}</span>
                <furigana-component :parent='"AUDIO"' v-bind:tokens="tokenList" class="furigana-component"></furigana-component>
                <span class="md-headline" style="width: 100%; text-align: center; margin-bottom: 20px;">{{ audioEnglish }}</span>
                <md-button class="md-raised md-primary" v-on:click="nextQuestion()">Next</md-button>
            </div>

            <div v-else>
                <md-field>
                    <form @submit.prevent="submitAnswer">
                        <md-input v-model="guess" placeholder="Enter your answer"></md-input>
                    </form>
                </md-field>
            </div>
        </div>
    </div>
</template>

<script>
import AudioPlayer from './AudioPlayer.vue'
import FuriganaComponent from './FuriganaComponent.vue';
import ClozeQuiz from './ClozeQuiz.vue'
import { mapGetters, mapState } from 'vuex';
import Mixins from '../mixins/Mixins'

export default {
    components: {
        'audio-player': AudioPlayer, 'furigana-component': FuriganaComponent, ClozeQuiz
    },
    mixins: [Mixins],
    props: {
    },
    data() {
        return {  
            isInputShown: true, // Used to flip between question and answer  
            questionType: 'cloze',
            guess: "",   // The user's latest guess,
            tokenList: []
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
        nextQuestion() {
            this.$store.dispatch('audio/getAudio')
        },
        test() {
            console.log(this.audioKana)
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
      this.furiganizeSentence(this.audioKana)
      .then(result => {
          this.tokenList = result;
      })
    },
    watch: {
        audioKana: function(newVal) {
            this.furiganizeSentence(newVal)
            .then(result => {
                this.tokenList = result;
            })
            this.isInputShown = true;
            this.guess = "";
        }
    }
}

</script>

<style lang="scss" scoped>


    .audio-player {
        margin: 20px auto 30px auto
    }
</style>
