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
import Flashcards from './components/FlashCards.vue'

export default {
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
