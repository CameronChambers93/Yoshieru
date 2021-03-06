import tries from '../../components/Tries.js'
import axios from 'axios'
import zlib from 'zlib'

class Node{
  constructor(value) {
    this.value = value;
    this.tail = null;
    this.head = null;
  }
}

class Entries {
  constructor(value) {
    let root = new Node(value);
    this.tail = root;
  }

  addNode(value) {
    let newNode = new Node(value);
    this.tail.tail = newNode;
    newNode.head = this.tail;
    //this.tail = newNode;
    return newNode;
  }

  pop() {
    this.tail = this.tail.head;
    this.tail.tail = null;
  }
}


// initial state
// shape: [{ id, quantity }]
const state = () => ({
    items: [],
    checkoutStatus: null,
    pageCounter: 0,
    pages: {tail: {value: null}},
    page: {}
  })
  
  // getters
  const getters = {
    idTrie: (state) => {
      return state.idTrie;
    },
    textTrie: (state) => {
      return state.textTrie;
    },
    previousEntryName: (state) => {
      if (state.pages.tail.head) {
        let entry = state.pages.tail.head.value[0]
        if (!(entry.k_ele))    // If entry reading contains no kanji
            return entry["r_ele"][0]["reb"];  
        else
                return entry["k_ele"][0]["keb"];
      }
      else
        return ''
    }
  }
  
  // actions
  const actions = {
      async INIT({ commit }) {
        let zippedDict = {};
        let unzippedDict = null;
        if (localStorage.getItem('JMdict_e.json.gz2') == null) {
          let result = await axios.get(`http://ec2-100-25-211-104.compute-1.amazonaws.com:5000/JMdict_e.json.gz`, {responseType: 'arraybuffer' })
          zippedDict = result.data
          localStorage.setItem('JMdict_e.json.gz', zippedDict)
          unzippedDict = JSON.parse(await zlib.gunzipSync(new Buffer(zippedDict)))
        }
        else {
          zippedDict = localStorage.getItem('JMdict_e.json.gz')
          try {
            unzippedDict = JSON.parse(await zlib.gunzipSync(new Buffer(zippedDict)))
          } catch {
            let result = await axios.get(`http://ec2-100-25-211-104.compute-1.amazonaws.com:5000/JMdict_e.json.gz`, {responseType: 'arraybuffer'})
            zippedDict = result.data
            localStorage.setItem('JMdict_e.json.gz', zippedDict)
            unzippedDict = JSON.parse(await zlib.gunzipSync(new Buffer(zippedDict)))
          }
        }
        console.log(unzippedDict)
        return new Promise((resolve) => {
          let [textTrie, idTrie] = tries(unzippedDict)
          let tmp = ["1562350"]
          commit('init_define', { ids: tmp, textTrie: textTrie, idTrie: idTrie })
          //commit('define',  {ids: tmp} )
          resolve();
        })
      },
      LOOKUP({ commit }, ids) {
        return new Promise((resolve) => {
          commit('define', ids )
          resolve();
        })
      },
      RESETDICT({ commit }) {
        commit('reset')
      },
      getCurrentPageCounter({ state }) {
        return state.pageCounter
      },
      getCurrentPage({ state }) {
        return state.pages.tail
      }
  }
  
  // mutations
  const mutations = {
    reset(state) {
      delete state.idTrie;
      delete state.textTrie;
    },
      define( state, { ids } ) {
        let newPage = []
        for (const id of ids) {
          newPage.push(state.idTrie.findWord(id))
        }
        let newEntry = state.pages.addNode(newPage);
        state.pages.tail = Object.assign({}, newEntry);
        state.pageCounter++;
        state.page = state.pages.tail.value
      },
      init_define( state, { ids, textTrie, idTrie } ) {
        state.textTrie = textTrie;
        state.idTrie = idTrie;
        let newPage = []
        for (const id of ids) {
          newPage.push(state.idTrie.findWord(id))
        }
        state.pages = new Entries(newPage)
        state.pageCounter = 1;
        state.page = state.pages.tail.value
      },
      getPreviousEntry( state ) {
        if (state.pages.tail.head) {
          state.pages.tail =  Object.assign({}, state.pages.tail.head);
          state.page = state.pages.tail.value
        }
      }
  }
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  }
