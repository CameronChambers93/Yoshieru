// initial state
import testDeck from '../../assets/testCards.json'
const state = () => ({
    decks: {'Test Deck': testDeck},
    counter: 5,
    currentDeck: {numCorrect: -1}
  })
  
  // getters
  const getters = {
    currentDeck: function(state) {
      return state.currentDeck
    },
    deckNames: function(state) {
      return Object.keys(state.decks);
    }
  }
  
  // actions
  const actions = {
    answerCorrect( {commit}, deck) {
      return new Promise(resolve => {
        commit('adjustScore', "PASSED");
        commit('answerCorrect', deck);
        resolve();
      })
    },
    answerWrong( {commit}, deck) {
      return new Promise(resolve => {
        commit('adjustScore', "FAILED");
        commit('answerWrong', deck);
        resolve();
      })
    },
  }
  
  // mutations
  const mutations = {
    setCurrentDeck(state, name) {
      state.currentDeck = state.decks[name]
    },
    removeCardFromDeck(state, index) {
      let score = state.currentDeck.deck[index].score;
      state.currentDeck['deck'].splice(index, 1);
      if (score)
        state.currentDeck.numCorrect -= 1;
    },
    /*  Adjusts the score of the current card after the user attempts an answer
    *  
    *  Currently implemented as a binary pass/fail, will use a more advanced method in the future
    */
    adjustScore(state, result) {
      if (result == "FAILED") {
        if (state.currentDeck['deck'][0]['score'] == 1) {  // If card was previously marked 'Passed', mark it 'Failed' and adjust the score accordingly
              state.currentDeck['deck'][0]['score'] = 0;
              state.currentDeck.numCorrect -= 1;
            }
          }
          else if (result == "PASSED") {
            if (state.currentDeck['deck'][0]['score'] == 0) {  // If card was previously marked 'Failed', mark it 'Passed' and adjust the score accordingly
            state.currentDeck['deck'][0]['score'] = 1;
            state.currentDeck.numCorrect += 1;
          }
        }
    },
    answerCorrect( state ){
      state.currentDeck['deck'].push(state.currentDeck['deck'].shift());    // Moves first card to end of set
    },
    answerWrong( state ){
      let x = state.currentDeck['deck'].length;
      if (x < 12)
          x = x / 3;
      let tempCard = state.currentDeck['deck'].shift();
      state.currentDeck['deck'].splice(x, 0, tempCard);
    },
    toMenu(state) {
      state.currentDeck = {};
    },
    createDeck(state, deckName) {
      state.decks = Object.assign({}, state.decks, {[deckName]: {
        "name" : name,
        "deck" : [],
        "numCorrect": 0,
        "cardFormatting": {
          "Front": [{"field": 'kanji', 'style': ''}],
          "Back" : [{"field": 'english', 'style': ''}]
          }}});
    },
    addCardToDeck(state, {deckNames, card}) {
      for (const name of deckNames) {
        state.decks[name].deck.push(card)
      }
    },
    deleteDeck(state, deckName) {
      delete state.decks[deckName]
      state.decks = Object.assign({}, state.decks)
    }
  }
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  }