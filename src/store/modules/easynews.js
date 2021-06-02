import axios from 'axios';

// initial state
const state = () => ({
    entries: [],
    endpoint: 'http://ec2-100-25-211-104.compute-1.amazonaws.com:5000/api/',
    entryCounter: -1
  })
  
  // getters
  const getters = {
    currentEntry: state => {
        if (state.entryCounter == -1) return null
        else return state.entries[state.entryCounter];
    }
  }
  
  // actions
  const actions = {
    getPosts({state, commit}) {
        axios(state.endpoint + "news", )
                .then(response => {
                    commit('setPosts', response.data.message);
                })
                .catch(error => {
                    console.log('---error---');
                    console.log(error);
                })
    },
    setCurrentEntry({state, commit}, {index, furiganizeSentence}) {
        if (index != -1) {
            if (!sessionStorage.getItem(state.entries[index].title.jpn)) {
                axios(state.endpoint + "news/" + state.entries[index].title.jpn).then(result => {
                    for (const paragraph of result.data.message.paragraphs) {
                        for (const sentence of paragraph) {
                            furiganizeSentence(sentence.jpn).then(result => {
                                sentence.furigana = result;
                            })
                        }
                    }

                    furiganizeSentence(state.entries[index].title.jpn).then(result => {
                        state.entries[index].title.furigana = result;
                    })                    

                    setTimeout(() => {
                        commit('saveEntry', result.data.message)
                        commit('loadEntry', {entry: result.data.message, index})
                        commit('setCurrentEntry', index);
                    }, 200);
                })
            }
            else {
                commit('loadEntry', {entry: JSON.parse(sessionStorage.getItem(state.entries[index].title.jpn)), index});
                commit('setCurrentEntry', index);
            }
        }
        else commit('setCurrentEntry', index);
    }
  }
  
  // mutations
  const mutations = {
    setPosts(state, data) {
        state.entries = data;
        state.entryCounter = -1;
    },
    setCurrentEntry(state, index) {
        state.entryCounter = index;
    },
    saveEntry(state, entry) {
        sessionStorage.setItem(entry.title.jpn, JSON.stringify(entry));
    },
    loadEntry(state, {entry, index}) {
        state.entries[index] = Object.assign({}, entry);
    }
  }
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  }