<template>
    <div>
        <md-content style="height: 80px; background-color: darkolivegreen; padding: 20px 0px 20px 0px; text-align: center; border-radius: 10px 10px 0px 0px;">
            <div v-if="currentSet == ''" class="md-headline">
                <span class="md-headline">Select a Deck</span>
            </div>
            <div v-else class="md-headline">
                <md-button class="md-default" v-on:click="toMenu" style="float:left">Menu</md-button>
                <span class="md-headline">{{ sets[currentSet]['deck'].length - unpassedCards }}  |  {{ unpassedCards }}</span>
            </div>
        </md-content>
        

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
        
        <md-content v-if="currentSet == ''" class="innerContent md-scrollbar" style="height: 595px; background-color: grey">
                <div style="display:block" v-for="(index, set) in this.sets" :key="set">
                    <div style="display:flex; width:100%" class="md-headline">
                        <md-button class="md-raised md-primary" v-on:click="setCurrentSet(set)">{{ set }}</md-button>
                        <div style="display:flex; width:100%; justify-content:flex-end; padding-right:.25em">
                            <div style="color:green;">
                                {{ sets[set]["deck"].length - sets[set]["numCorrect"] }}
                            </div>
                            &emsp;
                            <div style="color:red">
                                {{ sets[set]["numCorrect"] }}
                            </div>
                        </div>
                    </div>
                </div>
                <md-button class="new-deck-btn md-raised md-primary" v-on:click="atCreateDialog = true">Create new deck</md-button>
        </md-content>

        <md-content v-else class="innerContent md-scrollbar" style="height: 595px; padding: 0px 10px 0px 10px; overflow: auto; background-color: grey">
            <div v-on:click="revealCard">
                <div class="card">
                    <flashcard-component v-bind:html="currentFront" style="font-size:24px; width:100%" :key="furiganaCounter"></flashcard-component>
                </div>

                <div v-if="this.isBackShown == true" class="card">
                    <flashcard-component v-bind:html="currentBack" style="font-size:24px; width:100%" :key="furiganaCounter"></flashcard-component>
                </div>

                <div v-else style="opacity:50%" class="card">
                    <span class="md-body-1" style="font-size:16px">Tap to reveal answer</span>
                </div>
            </div>

            <div v-if="this.isBackShown == true">

                <md-button class="md-raised md-primary" v-on:click="answerCorrect">Correct</md-button>
                <md-button class="md-raised md-primary" v-on:click="answerWrong">Wrong</md-button>

            </div>

        </md-content>
    </div>
</template>

<script>
    export default {
        props: {
            sets: {
                default: null,
                type: Object
            }
        },

        data() {
            return {
                currentSet: "",
                isBackShown: false,
                furiganaCounter: 10,
                cardCounter: 0,
                currentFront: "",
                currentBack: "",
                unpassedCards: 0,
                atCreateDialog: false,
                deckName: "",
                nameError: false
            }
        },

        watch: {
            cardCounter: function () {
                this.currentFront = this.sets[this.currentSet]['deck'][0]['front'];
                this.currentBack = this.sets[this.currentSet]['deck'][0]['back'];
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

        methods: {

            // Reveals the answer to the current card. Replaces flipCard for the card body itself
            revealCard() {
                this.isBackShown = true;
            },

            // Sets the current set to one selected by user
            setCurrentSet(set) {
                this.isBackShown = true;
                this.currentSet = set;
                this.unpassedCards = this.sets[set]['deck'].length;
                this.isBackShown = false;
                this.cardCounter += 1;
            },

            // Shows/Hides the "back" of the flashcard
            flipCard() {
                this.isBackShown = !this.isBackShown;
            },

            // Primitive method to move the current card to the end of the current set
            answerCorrect() {
                this.isBackShown = true;
                this.adjustScore("Passed");
                this.sets[this.currentSet]['deck'].push(this.sets[this.currentSet]['deck'].shift());    // Moves first card to end of set
                this.isBackShown = false;
                this.cardCounter += 1;
            },

            /*  
             *
             */
            answerWrong() {
                this.isBackShown = true;

                this.adjustScore("Failed");

                let x = this.sets[this.currentSet]['deck'].length;
                if (x < 12)
                    x = x / 3;
                let tempCard = this.sets[this.currentSet]['deck'].shift();
                this.sets[this.currentSet]['deck'].splice(x, 0, tempCard);  
                this.isBackShown = false;
                this.cardCounter += 1;
            },

            /*  Adjusts the score of the current card after the user attempts an answer
             *  
             *  Currently implemented as a binary pass/fail, will use a more advanced method in the future
             */
            adjustScore(result) {
                if (result == "Failed") {
                    if (this.sets[this.currentSet]['deck'][0]['score'] == 1) {  // If card was previously marked 'Passed', mark it 'Failed' and adjust the score accordingly
                        this.sets[this.currentSet]['deck'][0]['score'] = 0;
                        if (this.unpassedCards <= this.sets[this.currentSet].length)
                            this.unpassedCards += 1;
                    }
                }
                else if (result == "Passed") {
                    if (this.sets[this.currentSet]['deck'][0]['score'] == 0) {  // If card was previously marked 'Failed', mark it 'Passed' and adjust the score accordingly
                        this.sets[this.currentSet]['deck'][0]['score'] = 1;
                        if (this.unpassedCards > 0)
                            this.unpassedCards -= 1;
                    }
                }
            },

            // Takes the user to the deck selection menu
            toMenu() {
                this.currentSet = "";
            
            },

            createDeck() {
                if (this.deckName == "") {
                    this.nameError = true;
                }
                else {
                    this.$eventHub.$emit('globalCreateDeck', this.deckName);
                    this.deckName = "";
                    this.atCreateDialog = false;
                }
            },

        }
}

</script>

<style lang="scss" scoped>

    .innerContent {
        padding: 10px;
        background-color: grey;
    }

    .card {
        padding: 10px;
        margin: 10px;
    }

    .new-deck-btn {
        float: right;
    }
</style>
