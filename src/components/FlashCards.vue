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
        
        <md-content v-if="currentSet == ''" class="innerContent md-scrollbar" style="height: 595px; background-color: grey">
                <md-button class="md-raised md-primary" v-for="(index, set) in this.sets" v-on:click="setCurrentSet(set)">{{ set }}</md-button>
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
    import axios from 'axios';
    

export default {
    props:
            ['sets'],

        data() {
            return {
                defaultSet: [],
                currentSet: "",
                currentIndex: 0,
                isBackShown: false,
                furiganaCounter: 10,
                cardCounter: 0,
                currentFront: "",
                currentBack: "",
                unpassedCards: 0,
            }
        },

        watch: {
            cardCounter: function () {
                this.currentFront = this.sets[this.currentSet]['deck'][0]['front']
                this.currentBack = this.sets[this.currentSet]['deck'][0]['back']
            }
        },

        created() {

        },

        methods: {

            //Reveals the answer to the current card. Replaces flipCard for the card body itself
            revealCard() {
                this.isBackShown = true;
            },

            //Sets the current set to one of the options presented to the user
            setCurrentSet(set) {
                this.isBackShown = true;
                this.currentSet = set;
                this.unpassedCards = this.sets[set]['deck'].length
                this.isBackShown = false;
                this.cardCounter += 1;
            },

            //Shows/Hides the "back" of the flashcard
            flipCard() {
                this.isBackShown = !this.isBackShown;
            },

            //Primitive method to move the current card to the end of the current set
            answerCorrect() {
                this.isBackShown = true;
                this.sets[this.currentSet]['deck'].push(this.sets[this.currentSet]['deck'].shift());
                this.isBackShown = false;
                this.cardCounter += 1;
                if (this.unpassedCards > 0)
                    this.unpassedCards -= 1;
            },

            //Primitive method to push back the current card by one third the size of the current set
            answerWrong() {
                this.isBackShown = true;
                let x = this.sets[this.currentSet]['deck'].length;
                if (x < 12) {
                    x = x / 3;
                }
                let tempCard = this.sets[this.currentSet]['deck'].shift();
                this.sets[this.currentSet]['deck'].splice(x, 0, tempCard);
                this.isBackShown = false;
                this.cardCounter += 1
            },
            toMenu() {
                this.currentSet = "";
            
            }
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
</style>
