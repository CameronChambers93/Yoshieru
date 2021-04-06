<template>
    <div>
        <md-content class="toolbar">
            <div v-if="!currentDeck.deck" class="md-headline">
                <span class="md-headline">Select a Deck</span>
            </div>
            <div v-else class="md-headline">
                <md-button class="md-default" @click="toMenu" style="float:left">Menu</md-button>
                <span class="md-headline">{{ currentDeck.numCorrect }}  |  {{ unpassedCards }}</span>
                <md-button class="md-default" @click="atDeckSettings = true"><md-icon>settings</md-icon></md-button>
            </div>
        </md-content>
        
        <md-drawer :md-active.sync="atDeckSettings">
            <md-toolbar class="md-transparent" md-elevation="1">
                <span class="md-title">{{ currentDeck.name }}</span>
            </md-toolbar>

            <md-list v-if="atDeckSettings == true">
                <md-list-item v-for="(card, index) in currentDeck['deck']" :key=index>
                    {{ card['front'] }}
                    <md-button class="md-default" @click="removeCardFromDeck(index)">
                        <md-icon>delete_forever</md-icon>
                    </md-button>
                </md-list-item>

            </md-list>
        </md-drawer>

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
        
        <md-content v-if="!currentDeck.deck" class="innerContent md-scrollbar" style="height: 595px; background-color: grey">
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
        </md-content>

        <md-content v-else class="innerContent md-scrollbar" style="height: 595px; padding: 0px 10px 0px 10px; overflow: auto; background-color: grey">
            <div @click="revealCard">
                <div class="card">
                    <flashcard-component :_html="currentFront" style="font-size:24px; width:100%" :key="furiganaCounter"></flashcard-component>
                </div>

                <div v-if="this.isBackShown == true" class="card">
                    <flashcard-component v-bind:_html="currentBack" style="font-size:24px; width:100%" :key="furiganaCounter"></flashcard-component>
                </div>

                <div v-else style="opacity:50%" class="card">
                    <span class="md-body-1" style="font-size:16px">Tap to reveal answer</span>
                </div>
            </div>

            <div v-if="this.isBackShown == true">

                <md-button class="md-raised md-primary" @click="answerCorrect">Correct</md-button>
                <md-button class="md-raised md-primary" @click="answerWrong">Wrong</md-button>

            </div>

        </md-content>
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import FlashCardComponent from './FlashcardComponent'
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

        data() {
            return {
                isBackShown: false,
                furiganaCounter: 10,
                cardCounter: 0,
                currentFront: "",
                currentBack: "",
                atCreateDialog: false,
                atDeckSettings: false,
                deckName: "",
                nameError: false
            }
        },
        components: {
            'flashcard-component': FlashCardComponent
        },
        watch: {
            cardCounter: function () {
                this.currentFront = this.currentDeck['deck'][0]['front'];
                this.currentBack = this.currentDeck['deck'][0]['back'];
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
            }
        },
        methods: {
            ...mapMutations('flashcards', ['setCurrentDeck', 'toMenu', 'removeCardFromDeck', 'deleteDeck']),
            ...mapActions('flashcards', ['answerCorrect', 'answerWrong']),
            // Reveals the answer to the current card. Replaces flipCard for the card body itself
            revealCard() {
                this.isBackShown = true;
            },

            // Sets the current set to one selected by user
            setCurrentDeck(deck) {
                this.isBackShown = true;
                this.$store.commit('flashcards/setCurrentDeck', deck)
                this.isBackShown = false;
                this.cardCounter += 1;
            },

            // Shows/Hides the "back" of the flashcard
            flipCard() {
                this.isBackShown = !this.isBackShown;
            },

            // Primitive method to move the current card to the end of the current deck
            answerCorrect() {
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

    .innerContent {
        margin-left: auto;
        margin-right: auto;
        background-color: grey;
        height: 595px;
        padding: 10px 10px 0px 10px;
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
        background-color: darkolivegreen !important;
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

    
</style>
