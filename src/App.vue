<template>
  <div id="app" style="margin-top: 0px;">
    <md-app>
      <md-app-toolbar class="md-medium">
          <span style="margin-left:auto; margin-right: auto;" class="header md-display-1">Yosh!eru</span>
      </md-app-toolbar>

      <md-app-content style="width:99%;">

        
        <div v-if="loading">
          <h1>Loading, please wait{{ loadingDots }}</h1>
        </div>
        <div v-else style="overflow: hidden;" class="md-layout md-alignment-center">
          <div class="main-layout-item md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
              <div class="main-md-content md-content md-elevation-10">
                  <Dictionary class="custom-component-container" />
              </div>
          </div>
          <div class="main-layout-item md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
              <div class="main-md-content md-content md-elevation-10">
                  <Flashcards class="custom-component-container" />
              </div>
          </div>
          <div class="main-layout-item md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100">
              <div class="main-md-content md-content md-elevation-10">
                  <Audio class="custom-component-container" />
              </div>
          </div>
        </div>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Dictionary from './components/Dictionary.vue'
import Audio from './components/Audio.vue'
import Flashcards from './components/Flashcards.vue'

export default {
<<<<<<< HEAD
    name: "App",       

    metaInfo() {
        return { 
            title: "Yoshieru - Japanese Study Tool",
        };
    },

    data () {
        return {
            posts: [],                  // A stack of words the user has looked up, to act as a 'history' feature
            endpoint: 'http://ec2-3-129-62-182.us-east-2.compute.amazonaws.com:3000/api/',      // API endpoint
            currentEntry: {},           // The word currently being defined
            flashcardDecks: {},         // Contains the flashcard decks
            kuroshiro: null,            // For adding furigana
            tokenizer: null,            // For splitting sentences into individual words (tokens)
            entryDict: {},              // For caching definitions
            lookupsDict: {},            // For caching searches
            previousEntry: "",          // Text displayed in the 'back' button in the Dictionary
            deckSelection: []           // Used to add new cards to flashcard decks
        }
    },

    computed: {
        
        flashcardDeckNames: function() {
            return Object.keys(this.flashcardDecks)
        }
    },

    created() {
        // Initiate a placeholder definition in the Dictionary
        this.posts.push({"id":"1562350","kanji":[{"common":true,"text":"話す","tags":[]},{"common":false,"text":"咄す","tags":[]}],"kana":[{"common":true,"text":"はなす","tags":[],"appliesToKanji":["*"]}],"sense":[{"partOfSpeech":["v5s","vt"],"appliesToKanji":["*"],"appliesToKana":["*"],"related":[],"antonym":[],"field":[],"dialect":[],"misc":[],"info":[],"languageSource":[],"gloss":[{"type":null,"lang":"eng","text":"to talk"},{"type":null,"lang":"eng","text":"to speak"},{"type":null,"lang":"eng","text":"to converse"},{"type":null,"lang":"eng","text":"to chat"}]},{"partOfSpeech":["v5s","vt"],"appliesToKanji":["*"],"appliesToKana":["*"],"related":[],"antonym":[],"field":[],"dialect":[],"misc":[],"info":[],"languageSource":[],"gloss":[{"type":null,"lang":"eng","text":"to tell"},{"type":null,"lang":"eng","text":"to explain"},{"type":null,"lang":"eng","text":"to narrate"},{"type":null,"lang":"eng","text":"to mention"},{"type":null,"lang":"eng","text":"to describe"},{"type":null,"lang":"eng","text":"to discuss"}]},{"partOfSpeech":["v5s","vt"],"appliesToKanji":["*"],"appliesToKana":["*"],"related":[],"antonym":[],"field":[],"dialect":[],"misc":[],"info":[],"languageSource":[],"gloss":[{"type":null,"lang":"eng","text":"to speak (a language)"}]}]})

        // Import a test deck for the flash cards
        this.flashcardDecks['Test Deck'] = testDeck;

        // Set up the Kuromoji tokenizer and Kuroshiro furigana-izer
        var promise = new Promise((resolve, reject) => {
            async function initAnalyzer() {
                let tokenizer = null;
                kuromoji.builder({ dicPath: "/public/dict/" }).build(function (error, _tokenizer) {
                    if (error != null) {
                        console.log(error);
                    }
                    tokenizer = _tokenizer;
                });
                await kuroshiro.init(analyzer);
                resolve(tokenizer)
            }
            initAnalyzer();
        });


        promise.then((result) => {
            console.log("Analyzer Initialized (App.vue)");
            this.tokenizer = result;
            this.kuroshiro = kuroshiro;
        }, (err) => {
                console.log("Analyzer Failed to Initialize");
            });

        this.$eventHub.$on('globalGetEntry', this.getEntry);
        this.$eventHub.$on('globalUpdateLookups', this.updateLookups);
        this.$eventHub.$on('globalCreateDeck', this.createDeck);
        this.$eventHub.$on('globalAddCardToDeck', this.addCardToDeck);
        this.$eventHub.$on('globalDeleteDeck', this.deleteDeck);
=======
  name: 'App',
  computed: {
    loadingDots() {
      return '.....'.substring( 5 - this.dotCount )
    }
  },
  data() {
    return {
      loading: true,
      dotCount: 0
    }
  },
  components: {
    Dictionary, Audio, Flashcards
>>>>>>> dev-branch
    },
  methods: {
    ...mapActions('analyzer', ["INITALIZE", "RESET", "getTokenizer"]),
    ...mapActions('dictionary', ["INIT", "RESETDICT"]),
    async loadingLoopDots() {
      if (this.loading) {
        this.dotCount = (this.dotCount + 1) % 5
        setTimeout(this.loadingLoopDots, 1000)
      }
    },
    loadingLoop() {
      let tokenizer = this.$store.state.analyzer.tokenizer;
      let kuroshiro = this.$store.state.analyzer.kuroshiro;
      let idTrie = this.$store.state.dictionary.idTrie;
      let textTrie = this.$store.state.dictionary.textTrie;
      if (tokenizer && kuroshiro && textTrie && idTrie)
        this.loading = false;
      else
        setTimeout(this.loadingLoop, 1000)
    }
  },
  created() {
    this.loadingLoopDots();
    this.INIT();
    this.$store.dispatch('analyzer/INITIALIZE')
    this.loadingLoop();
  },
  beforeDestroy() {
    this.RESET();
    this.RESETDICT();
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

    .main-md-content {
        border-radius: 10px;
        height: 680px;
    }

.main-layout-item {
        margin-left: 5px;
        margin-right: 5px;
        border-radius: 10px;
    }

.custom-component-container{
        height: 100%;
        margin-top: 0px;
        background-color: grey;
        border-radius: 10px;
    }

.md-content.md-theme-default{
  
}

.dg-content {
    color: black;
}

.dg-form {
    color: black;
}
</style>
