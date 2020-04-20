<template>    
    <md-dialog class="md-layout" :md-active.sync="atAddDialog" :md-click-outside-to-close="false">
        <md-dialog-title>Select Deck</md-dialog-title>
            <md-dialog-content>
                <md-content class="main-content">
                    <md-content class="md-layout-item">  
                        <div v-for='(name, index) in flashcardDeckNames' :key="index">
                            <md-checkbox v-model="deckSelection" :value=name>{{ name }}</md-checkbox>
                        </div>
                        <div style="color: red; margin-top: -10px" v-if="deckSelectionError == true">Please select a deck</div>
                    </md-content>
                    <md-content class="md-layout-item">  
                        <div v-for='(gloss, index) in gloss' :key='index'>
                            <md-checkbox v-model="definitionSelection" :value=gloss >{{ index + 1 }}. {{ gloss }}</md-checkbox>
                        </div>
                        <div style="color: red; margin-top: -10px" v-if="definitionSelectionError == true">Please select a definition</div>
                    </md-content>
                </md-content>     
            </md-dialog-content>

        <md-dialog-actions>
            <md-button class="md-primary" @click="closeDialog">Close</md-button>
            <md-button class="md-primary" @click="addCardToDeck">Save</md-button>
        </md-dialog-actions>
    </md-dialog>
</template>

<script>

    export default {
        props: {
            atAddDialog: {
                default: false,
                type: Boolean
            },
            flashcardDeckNames: {
                default: () => {
                    return []
                },
                type: Array
            },
            entry: {
                default: () => {
                    return null
                },
                type: Object
            },
            gloss: {
                default: () => {
                    return [""]
                },
                type: Array
            }
        },

        data() {
            return {
                deckSelection: [],
                deckSelectionError: false,
                definitionSelectionError: false,
                definitionSelection: [],
            }
        },

        computed: {
        },
        

        created() {
        },

        watch: {
        },


        methods: {
            
            getReading() {
                let tmpReading = "";
		        if (!this.entry.hasOwnProperty("k_ele"))    // If entry reading contains no kanji
			        tmpReading = this.entry["r_ele"][0]["reb"][0];  
		        else
                    tmpReading = this.entry["k_ele"][0]["keb"][0];
                return tmpReading;
            },

            // TODO: Add option for kanji/furigana
            getNewCardContents() {
                let back = "";
                for (let i = 0; i < this.definitionSelection.length; i++) {
                    back += this.definitionSelection[i];
                    if (i < this.definitionSelection.length - 1)
                        back += "\n";
                }
                return {
                    "front": this.getReading(),
                    "back": back
                }
            },

            emitGlobalGetEntry(id) {
                this.$eventHub.$emit('globalGetEntry', id)
            },

            addCardToDeck() {
                this.newCardContents = this.getNewCardContents();
                if (this.deckSelection.length == 0) {
                    this.deckSelectionError = true;
                elif (this.definitionSelection.length == 0)  
                    this.definitionSelectionError = true;
                }
                else {
                    this.$eventHub.$emit('globalAddCardToDeck', 
                    {
                        "decks": this.deckSelection,
                        "card": this.newCardContents
                    });
                    this.definitionSelection = []
                    this.deckSelectionError = false;
                    this.closeDialog();

                }
            },

            closeDialog() {
                this.deckSelectionError = false;
                this.$emit('closeDialog');
            }
        }
    }

</script>

<style lang="scss" scoped>

    .main-content {
        display: flex;
        overflow: auto;
        scrollbar-width: none;  /* FireFox */
        -ms-overflow-style: none; /* IE 10+ */
    }
        ::-webkit-scrollbar { 
        display: none; /* Chrome Safari */
        width: 0px;  /* Remove scrollbar space */
        background: transparent;  /* Optional: just make scrollbar invisible */
    }

</style>
