import Vue from 'vue';
import Meta from 'vue-meta';
import App from './App.vue';
import Dictionary from './components/Dictionary.vue';
import Audio from './components/Audio.vue';
import AudioPlayer from './components/AudioPlayer.vue';
import FlaschCards from './components/Flashcards.vue';
import FuriganaComponent from './components/FuriganaComponent.vue';
import FlashcardComponent from './components/FlashcardComponent.vue';
import AddToDictionaryPopup from './components/AddToDictionaryPopup.vue';

//Importing individual Material components
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default-dark.css'

//For easy custom dialog
import VuejsDialog from 'vuejs-dialog';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';

Vue.use(VueMaterial)
Vue.use(Meta);
Vue.use(VuejsDialog);

//Configure Routes
import Router from 'vue-router'
const router = new Router({
    routes: [],
    mode: 'history'
});


//Register the Components
Vue.component('audio-container', Audio)
Vue.component('audio-player', AudioPlayer)
Vue.component('dictionary-container', Dictionary)
Vue.component('furigana-component', FuriganaComponent)
Vue.component('flashcard-container', FlaschCards)
Vue.component('flashcard-component', FlashcardComponent)

// Registers the Global Event Bus
Vue.prototype.$eventHub = new Vue();


new Vue({
    el: '#app',
    router,
    render: h => h(App) // <-- that one
  })
