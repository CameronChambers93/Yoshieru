import axios from 'axios';

// initial state
const state = () => ({
    all: [],
    audioComponentCounter: 0,   // Used to refresh the furigana-component in order to refresh the audio file
    tokenList: [],  // Array containing transcription of current audio file, with furigana and links to corresponding entries. Passed to furigana-component
    audio: {
      'eng_text': '1',
      'audioKana': '2',
      'audioAuthor': '3',
      'licenseType': '4',
      'licenseLink': '5'
    },
    endpoint: 'http://ec2-100-25-211-104.compute-1.amazonaws.com:5000/api',
    computedFilepath: ''
  })
  
  // getters
  const getters = {
      audioEnglish: function (state) {
        if (state.audio.eng_text != '')
            return state.audio.eng_text
        else
            return ''
    },
    audioKana: function (state) {
        if (state.audio['jpn_text'] != '')
            return state.audio['jpn_text']
        else
            return ''
    },
    audioAuthor: function(state) {
        if (state.audio.author != '') {
            return state.audio.author
        }
        else return ''
    },
    licenseType: function(state) {
        if (state.audio.license_type != '') {
            if (state.audio.license_type != '\\N') {
                return state.audio.license_type
            }
            else {
                return 'CC'
            }
        }
        else return '';
    },
    licenseLink: function(state) {
        const default_link_base = 'https://tatoeba.org/eng/user/profile/'
        if (state.audio.license_link != null) {
            if (state.audio.license_link == '\\N') {
                return default_link_base + state.audio.author
            }
            else {
                return state.audio.license_link
            }
        }
        else return '';
    }
  }
  
  // actions
  const actions = {
    getAudio({ commit, state }) {
      return new Promise((resolve, reject) => {
        axios(`${state.endpoint}/randomAudio/`)
                    .then(response => {
                        commit('processAudioData', response.data);
                        resolve();
                    })
                    .catch(error => {
                        console.log('---error---');
                        console.log(error);
                        reject();
                    })
      })
    }
  }
  
  // mutations
  const mutations = {
    processAudioData(state, data) {
      state.audio = Object.assign({}, data);
      console.log(state.audio)
      state.computedFilepath = "https://audio.tatoeba.org/sentences/jpn/" + data["jpn_id"] + '.mp3';  // This API call returns an audio stream of the specified file to be used by the mediaserver library
      state.audioComponentCounter += 1;    // Refresh the furigana-component
    },
  }
  
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  }