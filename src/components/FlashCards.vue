<template>
    <div id="GRID" class="grid-container">
        <div class="toolbar">
            <div v-if="!currentDeck.deck" class="md-headline">
                <span class="md-headline">Select a Deck</span>
            </div>
            <div v-else class="md-headline">
                <md-button class="md-default" @click="toMenu" style="float:left">Menu</md-button>
                <span class="md-headline">{{ currentDeck.numCorrect }}  |  {{ unpassedCards }}</span>
                <md-button class="md-default" @click="atDeckSettings = !atDeckSettings" style="min-width: 2em; margin-right: 1em"><md-icon style="color: white !important;">settings</md-icon></md-button>
            </div>
        </div>
        
        <md-dialog class="md-layout" :md-active.sync="atDeckSettings2">
            <md-dialog-title class="md-transparent" md-elevation="1">
                <span class="md-title">{{ currentDeck.name }}</span>
            </md-dialog-title>

            <md-dialog-content>
                <div v-if="atDeckSettings2 == true">
                    <div v-for="(card, index) in currentDeck['deck']" :key=index style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;">
                        <div>{{ card['kanji'] }}</div>
                        <div>{{ card['kana'] }}</div>
                        <div>{{ getPrettyDate(card['date']) }}</div>
                        <md-button class="md-default" @click="removeCardFromDeck(index)">
                            <md-icon>delete_forever</md-icon>
                        </md-button>
                    </div>

                </div>
                <div>
                    <div v-for="(side, index) of currentCardFormatting" :key='index' style="display: grid">
                        <h3>{{index}}</h3>
                        <div v-for="(field, i) of side" :key="i" style="display: flex; align-items: flex-start; width: 100%">
                            <select style="width: 4rem; height: 2rem;" v-model='field.field'>
                                <option value='kanji'>kanji</option>
                                <option value='kana'>kana</option>
                                <option value='furigana'>furigana</option>
                                <option value='english'>english</option>
                                <option value='sentence_eng'>sentence_eng</option>
                                <option value='sentence_kanji'>sentence_kanji</option>
                            </select>
                            <textarea v-model="field.style" />
                            <md-button class="md-default" @click="removeStyle(side, i)">
                                <md-icon>delete_forever</md-icon>
                            </md-button>
                        </div>
                        <md-button style="width: 100%" class="md-default" @click="addStyle(side)">
                            <md-icon>add</md-icon>
                        </md-button>
                    </div>
                </div>
            </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click="atDeckSettings = false">Close</md-button>
            </md-dialog-actions>
        </md-dialog>

        <md-dialog class="md-layout" :md-active.sync="atCreateDialog" :md-click-outside-to-close="false">
            <md-dialog-title>Enter deck name</md-dialog-title>
                <md-dialog-content>        
                    <div class="md-layout-item">  
                        <md-field>
                            <label>Name</label>
                            <md-input v-model="deckName"/>
                        </md-field>
                        <div style="color: red; margin-top: -10px" v-if="nameError == true">Please enter a deck name</div>
                    </div>
                </md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click="atCreateDialog = false">Close</md-button>
                <md-button class="md-primary" @click="createDeck">Save</md-button>
            </md-dialog-actions>
        </md-dialog>
        
        <div v-if="!currentDeck.deck" class="innerContent md-scrollbar">
                <div style="display:block" v-for="(index, deck) in this.decks" :key="deck">
                    <div style="display:flex; width:100%" class="md-headline">
                        <md-button class="md-raised md-primary" @click="setCurrentDeck(deck)">{{ deck }}</md-button>
                        <div style="display:flex; width:100%; justify-content:flex-end; padding-right:.25em">
                            <div style="color:green;">
                                {{ decks[deck]["numCorrect"] }}
                            </div>
                            &emsp;
                            <div style="color:red">
                                {{ decks[deck]["deck"].length - decks[deck]["numCorrect"] }}
                            </div>

                            <md-button class="md-default" @click="deleteDeck(deck)">
                                <md-icon>delete_forever</md-icon>
                            </md-button>
                        </div>
                    </div>
                </div>
                <md-button class="new-deck-btn md-raised md-primary" @click="atCreateDialog = true">Create new deck</md-button>
        </div>

        <div v-else class="innerContent md-scrollbar">
            <div v-if="atDeckSettings"
                class="settings-popup md-scrollbar"
                >
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;">
                    <div>Kanji</div>
                    <div>Kana</div>
                    <div>Date Added</div>
                </div>
                <div v-for="(card, index) in currentDeck['deck']" :key=index style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;">
                    <div>{{ card['kanji'] }}</div>
                    <div>{{ card['kana'] }}</div>
                    <div>{{ getPrettyDate(card['date']) }}</div>
                    <md-button class="md-default" @click="removeCardFromDeck(index)">
                        <md-icon>delete_forever</md-icon>
                    </md-button>
                </div>
                <div>
                    <div v-for="(side, index) of currentCardFormatting" :key='index' style="display: grid">
                        <h3>{{index}}</h3>
                        <div v-for="(field, i) of side" :key="i" style="display: flex; align-items: flex-start; width: 100%">
                            <select style="width: 4rem; height: 2rem;" v-model='field.field'>
                                <option value='kanji'>kanji</option>
                                <option value='kana'>kana</option>
                                <option value='furigana'>furigana</option>
                                <option value='english'>english</option>
                                <option value='sentence_eng'>sentence_eng</option>
                                <option value='sentence_kanji'>sentence_kanji</option>
                            </select>
                            <textarea v-model="field.style" />
                            <md-button class="md-default" @click="removeStyle(side, i)">
                                <md-icon>delete_forever</md-icon>
                            </md-button>
                        </div>
                        <md-button style="width: 100%" class="md-default" @click="addStyle(side)">
                            <md-icon>add</md-icon>
                        </md-button>
                    </div>
                </div>
            </div>
            <div v-else @click="revealCard">
                <div v-if="currentCardFormatting" style="padding-top: 2rem;"> 
                    <div v-for="(field, index) of currentCardFormatting.Front" :key='index' :style="field.style">
                        <div v-if="field.field == 'sentence_eng'">
                            {{ sentenceEng }}
                        </div>
                        <div v-if="field.field == 'sentence_kanji'">
                            <furigana-component :parent='"AUDIO"' :styleString="field.style" v-bind:tokens="sentenceKanjiWithFurigana" class="furigana-component"></furigana-component>
                        </div>
                        <div v-if="field.field == 'furigana'">
                            <div v-html='currentDeck.deck[0].furigana' />
                        </div>
                        <div v-else>
                            {{ currentDeck.deck[0][field.field] }}
                        </div>
                    </div>
                </div>

                <div v-if="this.isBackShown == true" class="card">
                    <div v-for="(field, index) of currentCardFormatting.Back" :key='index + "z"' :style="field.style">
                        <div v-if="field.field == 'sentence_eng'">
                            {{ sentenceEng }}
                        </div>
                        <div v-if="field.field == 'sentence_kanji'">
                            <furigana-component :parent='"AUDIO"' v-bind:tokens="sentenceKanjiWithFurigana" class="furigana-component"></furigana-component>
                        </div>
                        <div v-if="field.field == 'furigana'" :html='currentDeck.deck[0].furigana'>
                        </div>
                        <div v-else>
                            {{ currentDeck.deck[0][field.field] }}
                        </div>
                    </div>
                </div>

                <div v-else style="opacity:50%" class="card">
                    <span class="md-body-1" style="font-size:16px">Tap to reveal answer</span>
                </div>
                <div v-if="this.isBackShown == true">

                    <md-button class="md-raised md-primary" v-on:click.stop="answerCorrect">Correct</md-button>
                    <md-button class="md-raised md-primary" v-on:click.stop="answerWrong">Wrong</md-button>

                </div>
            </div>
            
        </div>


    </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import Mixins from '../mixins/Mixins'
import axios from 'axios'
import FuriganaComponent from './FuriganaComponent'

    export default {
        props: {

            /* Decks will take the following form:
            * 'name': string
            * 'deck': [
            *     'front': string,
            *     'back': string,
            *     'score': number       
            *    ],
            * 'numCorrect': number
            */
        },

        mixins: [Mixins],

        data() {
            return {
                isBackShown: false,
                furiganaCounter: 1000,
                cardCounter: 0,
                deckCounter: 300,
                currentFront: "",
                currentBack: "",
                endpoint: 'http://ec2-100-25-211-104.compute-1.amazonaws.com:5000/api/',
                atCreateDialog: false,
                atDeckSettings: false,
                atDeckSettings2: false,
                deckName: "",
                nameError: false,
                currentCardFormatting: null,
                sentenceEng: '',
                sentenceKanji: '',
                sentenceKanjiWithFurigana: [],
                lookupSentences: false,
            }
        },
        components: {
            'furigana-component': FuriganaComponent
        },
        watch: {
            deckCounter: function() {
                console.log(JSON.stringify(this.currentDeck))
                this.lookupSentences = false;
                for (let side of Object.values(this.currentCardFormatting)) {
                    for (let field of Object.values(side)) {
                        if (field.field == 'sentence_eng' || field.field == 'sentence_kanji')
                            this.lookupSentences = true;
                    }
                }
            },
            cardCounter: function () {
                this.currentBack = this.currentDeck['deck'][0]['back'];
                this.currentEntry = (this.getWord(this.currentDeck['deck'][0].id))
                this.currentCardFormatting = this.currentDeck.cardFormatting;
                this.sentenceKanji = [];
                //this.sentenceKanjiWithFurigana = [];
                this.sentenceEng = '';
                if (this.lookupSentences)
                    this.getRandomSentence(this.currentDeck.deck[0].kanji)
                this.isBackShown = false;
            },

            // Resets the error dialog when creating a deck
            atCreateDialog: function() {
                this.nameError = false;
            }
        },

        created() {
        },

        validations: {
            form: {
                deckName: {
                    required: true,
                    minLength: 2
                }
            }
        },
        computed: {
            ...mapState({
                decks: state => state.flashcards.decks,
                currentDeck: state => state.flashcards.currentDeck,
            }),
            ...mapGetters('flashcards', {
                deckNames: 'deckNames'
            }),
            unpassedCards: function() {
                if (this.currentDeck.deck)
                    return this.currentDeck.deck.length - this.currentDeck.numCorrect;
                else
                    return -1
            },
        },
        methods: {
            ...mapMutations('flashcards', ['setCurrentDeck', 'toMenu', 'removeCardFromDeck', 'deleteDeck']),
            ...mapActions('flashcards', ['answerCorrect', 'answerWrong']),

            /*  For a given date, returns a string with the following format:
            *     YYYY-MM-DD  
            */
            getPrettyDate(_date) {
                let date = new Date(_date);
                return `${date.getYear()}-${this.pad(date.getMonth() + 1, 2, 0)}-${this.pad(date.getDate(), 2, 0)}`
            },

            /* For a given string n, pads string with desired character to achieve desired length
            *   n: String to be padded
            *   width: Desired length of output
            *   z: Character to pad string with (default 0)
            */
            pad(n, width, z) {
                z = z || "0";
                n = n + "";
                return n.length >= width
                    ? n
                    : new Array(width - n.length + 1).join(z) + n;
            },
            getRandomSentence(reading) {
                axios(this.endpoint + 'get_random_sentence/?k_ele=' + reading)
                        .then(response => {
                            this.sentenceEng = response.data.eng_text;
                            this.sentenceKanji = response.data.jpn_text;
                            this.furiganizeSentence(response.data.jpn_text)
                            .then(results => {
                                this.sentenceKanjiWithFurigana = results
                            })
                        })
                        .catch(error => {
                            console.log('---error---');
                            console.log(error);
                        })
            },
            
            // Reveals the answer to the current card. Replaces flipCard for the card body itself
            revealCard() {
                console.log('hi')
                this.isBackShown = true;
            },

            removeStyle(side, field) {
                side.splice(field, 1);
            },

            addStyle(side) {
                side.push({field: 'kanji', style: ''})
            },

            // Sets the current set to one selected by user
            setCurrentDeck(deck) {
                this.isBackShown = true;
                this.$store.commit('flashcards/setCurrentDeck', deck)
                this.isBackShown = false;
                this.deckCounter += 1;
                this.cardCounter += 1;
            },

            // Shows/Hides the "back" of the flashcard
            flipCard() {
                this.isBackShown = !this.isBackShown;
            },

            // Primitive method to move the current card to the end of the current deck
            answerCorrect() {
                this.isBackShown = false;
                this.$store.dispatch('flashcards/answerCorrect', this.currentDeck.name)
                this.isBackShown = false;
                this.cardCounter += 1;
            },

            /*  
             *
             */
            answerWrong() {
                this.isBackShown = true;
                this.$store.dispatch('flashcards/answerWrong', this.currentDeck.name)
                this.isBackShown = false;
                this.cardCounter += 1;
            },

            // Takes the user to the deck selection menu
            toMenu() {
                this.$store.commit('flashcards/toMenu');
            
            },

            createDeck() {
                if (this.deckName == "") {
                    this.nameError = true;
                }
                else {
                    this.$store.commit('flashcards/createDeck', this.deckName);
                    this.deckName = "";
                    this.atCreateDialog = false;
                }
            },

            deleteDeck(deck) {
                let message = "Are you sure you want to delete " + deck + "?";

                let options = {
                    okText: 'Continue',
                    cancelText: 'Close',
                    animation: 'zoom', // Available: "zoom", "bounce", "fade"
                    type: 'hard', // coming soon: 'soft', 'hard'
                    verification: deck, // for hard confirm, user will be prompted to type this to enable the proceed button
                    verificationHelp: 'Type "[+:verification]" below to confirm', // Verification help text. [+:verification] will be matched with 'options.verification' (i.e 'Type "continue" below to confirm')
                    clicksCount: 3, // for soft confirm, user will be asked to click on "proceed" btn 3 times before actually proceeding
                    backdropClose: false, // set to true to close the dialog when clicking outside of the dialog window, i.e. click landing on the mask
                    customClass: '' // Custom class to be injected into the parent node for the current dialog instance
                };

                this.$dialog.confirm(message, options)
                    .then( () => {
                        this.$store.commit('flashcards/deleteDeck', deck)
                        this.atCreateDialog = true;
                        this.atCreateDialog = false;
                    })
                    .catch( () => {
                        // This will be triggered when user clicks on cancel
                    });
            },
        }
}

</script>

<style lang="scss" scoped>

.md-icon{
    color: black !important;
}

    .grid-container{
        display: grid;
        grid-template-rows: 4em auto
    }

    .innerContent {
        color: black;
        margin: 1rem;
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 100%;
        background-color: white;
        overflow: auto;
        scrollbar-width: none;  /* FireFox */
        -ms-overflow-style: none; /* IE 10+ */
        ::-webkit-scrollbar { 
        display: none; /* Chrome Safari */
    }
    }

    .toolbar {
        display: flex;
        background-color: var(--flashcards-color) !important;
        text-align: center;
        border-radius: 10px 10px 0px 0px;
        align-items: center;
        justify-content: center;
    }

    .card {
        padding: 10px;
        margin: 10px;
    }

    .new-deck-btn {
        float: right;
    }

    .settings-popup{
        padding: 1rem 0 1rem 0;
        position: relative;
        left: 1.2rem;
        width: 100%;
        min-width: 40rem;
        z-index: 0;
        overflow: auto;
        scrollbar-width: none;  /* FireFox */
        -ms-overflow-style: none; /* IE 10+ */
        ::-webkit-scrollbar { 
        display: none; /* Chrome Safari */
        }
    }
    
</style>
