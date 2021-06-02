
// initial state
const state = () => ({
    knownKanjiIds: {},
  })
  
  // getters
  const getters = {
  }
  
  // actions
  const actions = {
    addEntryToFuriganaList({ commit }, id) {
      commit('addEntryToFuriganaList', id);
    },
    removeEntryFromFuriganaList({ commit }, id) {
      commit('removeEntryFromFuriganaList', id);
    },
  }
    // mutations
    const mutations = {
      addEntryToFuriganaList(state, id) {
        state.knownKanjiIds = Object.assign({}, {...state.knownKanjiIds, [id]: true});
      },
      removeEntryFromFuriganaList(state, id) {
        delete state.knownKanjiIds[id];
        state.knownKanjiIds = Object.assign({}, state.knownKanjiIds);
      },
  }
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  }