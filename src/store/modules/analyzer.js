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
      INITIALIZE({ commit }) {
        return new Promise(resolve => {
          console.log('kuroshiro s')
          let kuroshiro = new Kuroshiro();
          console.log('kuroshiro e')
          console.log('analyzer s')
          let analyzer = new KuromojiAnalyzer({dictPath: "./dict/"});
          console.log('analyzer e')
          let promise = new Promise(resolve => {
            console.log('init s')
            kuroshiro.init(analyzer).then(() => {
              console.log('init e')
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