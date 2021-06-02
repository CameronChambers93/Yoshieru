import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

const defaultState = () => ({
  analyzers: null
})

// initial state
const state = () => ({
    analyzers: null,
  })
  
  // getters
  const getters = {
  }
  
  // actions
  const actions = {
    addFurigana({ state }, text) {
      return new Promise(resolve => {
        let result = state.kuroshiro.convert(text, {mode: 'furigana', to: 'hiragana' })
        resolve(result);
      })
    },
    TOKENIZE({ state }, { text }) {
      return new Promise(resolve => {
        let tokens = state.tokenizer.tokenize(text);
        resolve(tokens)
      })
    },
      async INITIALIZE({ commit }) {
        return new Promise(resolve => {
          let kuroshiro = new Kuroshiro();
          let analyzer = new KuromojiAnalyzer({dictPath: "./dict/"});
          let promise = new Promise(resolve => {
            kuroshiro.init(analyzer).then(() => {
              resolve()
            })
          });
          
          promise.then(() => {
            commit('initialize',  kuroshiro)
            resolve()
        })

        })
    },
    RESET({ state }) {
      delete state.kuroshiro;
      delete state.analyzer;
      Object.assign(state, defaultState)
    },
    getTokenizer({ state }) {
      return new Promise(resolve => {
          resolve(state.tokenizer)
      })
    }
  }
    // mutations
    const mutations = {
      initialize( state, kuroshiro) {
        state.kuroshiro = kuroshiro;
        state.tokenizer = kuroshiro._analyzer._analyzer;
      }
  }
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  }