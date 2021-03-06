import Vue from 'vue'
import Vuex from 'vuex'
import dictionary from './modules/dictionary.js'
import flashcards from './modules/flashcards.js'
import audio from './modules/audio.js'
import analyzer from './modules/analyzer.js'
import user from './modules/user.js'
import easynews from './modules/easynews.js'
//import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

//const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    dictionary,
    flashcards,
    audio,
    analyzer,
    user,
    easynews
  },
  //strict: debug,
  //plugins: debug ? [createLogger()] : []
})