<template>
  <div id="app" style="margin-top: 0px; height: 100%; overflow: hidden !important">
    <md-app style="height: 100%; overflow: hidden !important">
      <md-app-toolbar id="app-toolbar" class="md-medium">
          <span style="margin-left:auto; margin-right: auto; overflow: hidden !important" class="header md-display-1">Yosh!eru</span>
      </md-app-toolbar>

      <md-app-content style="width:100%; overflow: hidden !important">

        
        <div v-if="loading">
          <h1>Loading, please wait{{ loadingDots }}</h1>
        </div>
        <div v-else style="overflow: hidden;" class="md-layout md-alignment-center">
          <div class="resizeable" id="DICTIONARY" v-if="componentVisibility['DICTIONARY']" v-on:mousedown="bringWindowToFront('DICTIONARY')">
            <div class="mover" v-if='!windowInfo["DICTIONARY"].minimized' v-on:mousedown="moverMousedown('DICTIONARY', $event)" v-on:dblclick="minimizeWindow('DICTIONARY', $event)" />
            <div class="mover" v-else v-on:mousedown="moverMousedown('DICTIONARY', $event)" v-on:dblclick="maximizeWindow('DICTIONARY', $event)" />
            <div class="closer" v-on:click="closeWindow('DICTIONARY')">
              <md-icon>clear</md-icon>
            </div>
            <div v-if='!windowInfo["DICTIONARY"].minimized' class="minimizer" v-on:click="minimizeWindow('DICTIONARY', $event)">
              <md-icon>remove</md-icon>
            </div>
            <div v-else class="minimizer" v-on:click="maximizeWindow('DICTIONARY', $event)">
              <md-icon>crop_din</md-icon>
            </div>
            
            <div v-if="!windowInfo['DICTIONARY'].minimized" class="resizer ne" v-on:mousedown="resizerMousedown"></div>
            <div v-if="!windowInfo['DICTIONARY'].minimized" class="resizer nw" v-on:mousedown="resizerMousedown"></div>
            <div v-if="!windowInfo['DICTIONARY'].minimized" class="resizer sw" v-on:mousedown="resizerMousedown"></div>
            <div v-if="!windowInfo['DICTIONARY'].minimized" class="resizer se" v-on:mousedown="resizerMousedown"></div>
            <Dictionary class="custom-component-container md-elevation-3" />
          </div>

          
          <div class="resizeable" id="FLASHCARDS" v-if="componentVisibility['FLASHCARDS']" v-on:mousedown="bringWindowToFront('FLASHCARDS')">
            <div class="mover" v-if='!windowInfo["FLASHCARDS"].minimized' v-on:mousedown="moverMousedown('FLASHCARDS', $event)" v-on:dblclick="minimizeWindow('FLASHCARDS', $event)" />
            <div class="mover" v-else v-on:mousedown="moverMousedown('FLASHCARDS', $event)" v-on:dblclick="maximizeWindow('FLASHCARDS', $event)" />
            <div class="closer" v-on:click="closeWindow('FLASHCARDS')">
              <md-icon>clear</md-icon>
            </div>
            <div v-if='!windowInfo["FLASHCARDS"].minimized' class="minimizer" v-on:click="minimizeWindow('FLASHCARDS', $event)">
              <md-icon>remove</md-icon>
            </div>
            <div v-else class="minimizer" v-on:click="maximizeWindow('FLASHCARDS', $event)">
              <md-icon>crop_din</md-icon>
            </div>

            <div v-if="!windowInfo['FLASHCARDS'].minimized" class="resizer ne" v-on:mousedown="resizerMousedown"></div>
            <div v-if="!windowInfo['FLASHCARDS'].minimized" class="resizer nw" v-on:mousedown="resizerMousedown"></div>
            <div v-if="!windowInfo['FLASHCARDS'].minimized" class="resizer sw" v-on:mousedown="resizerMousedown"></div>
            <div v-if="!windowInfo['FLASHCARDS'].minimized" class="resizer se" v-on:mousedown="resizerMousedown"></div>
            <Flashcards class="custom-component-container md-elevation-3" />
          </div>
          
          <div class="resizeable" id="AUDIO" v-if="componentVisibility['AUDIO']" v-on:mousedown="bringWindowToFront('AUDIO')">
            <div class="mover" v-if='!windowInfo["AUDIO"].minimized' v-on:mousedown="moverMousedown('AUDIO', $event)" v-on:dblclick="minimizeWindow('AUDIO', $event)" />
            <div class="mover" v-else v-on:mousedown="moverMousedown('AUDIO', $event)" v-on:dblclick="maximizeWindow('AUDIO', $event)" />
            <div class="closer" v-on:click="closeWindow('AUDIO')">
              <md-icon>clear</md-icon>
            </div>
            <div v-if='!windowInfo["AUDIO"].minimized' class="minimizer" v-on:click="minimizeWindow('AUDIO', $event)">
              <md-icon>remove</md-icon>
            </div>
            <div v-else class="minimizer" v-on:click="maximizeWindow('AUDIO', $event)">
              <md-icon>crop_din</md-icon>
            </div>

            <div v-if="!windowInfo['AUDIO'].minimized" class="resizer ne" v-on:mousedown="resizerMousedown"></div>
            <div v-if="!windowInfo['AUDIO'].minimized" class="resizer nw" v-on:mousedown="resizerMousedown"></div>
            <div v-if="!windowInfo['AUDIO'].minimized" class="resizer sw" v-on:mousedown="resizerMousedown"></div>
            <div v-if="!windowInfo['AUDIO'].minimized" class="resizer se" v-on:mousedown="resizerMousedown"></div>
            <Audio class="custom-component-container md-elevation-3" />
          </div>

          <div class="resizeable" id="EASYNEWS" v-if="componentVisibility['EASYNEWS']" v-on:mousedown="bringWindowToFront('EASYNEWS')">
            <div class="mover" v-if='!windowInfo["EASYNEWS"].minimized' v-on:mousedown="moverMousedown('EASYNEWS', $event)" v-on:dblclick="minimizeWindow('EASYNEWS', $event)" />
            <div class="mover" v-else v-on:mousedown="moverMousedown('EASYNEWS', $event)" v-on:dblclick="maximizeWindow('EASYNEWS', $event)" />
            <div class="closer" v-on:click="closeWindow('EASYNEWS')">
              <md-icon>clear</md-icon>
            </div>
            <div v-if='!windowInfo["EASYNEWS"].minimized' class="minimizer" v-on:click="minimizeWindow('EASYNEWS', $event)">
              <md-icon>remove</md-icon>
            </div>
            <div v-else class="minimizer" v-on:click="maximizeWindow('EASYNEWS', $event)">
              <md-icon>crop_din</md-icon>
            </div>

            <div v-if="!windowInfo['EASYNEWS'].minimized" class="resizer ne" v-on:mousedown="resizerMousedown"></div>
            <div v-if="!windowInfo['EASYNEWS'].minimized" class="resizer nw" v-on:mousedown="resizerMousedown"></div>
            <div v-if="!windowInfo['EASYNEWS'].minimized" class="resizer sw" v-on:mousedown="resizerMousedown"></div>
            <div v-if="!windowInfo['EASYNEWS'].minimized" class="resizer se" v-on:mousedown="resizerMousedown"></div>
            <EasyNews class="custom-component-container md-elevation-3" />
          </div>

          <div class="resizeable" id="YOUTUBE" v-if="componentVisibility['YOUTUBE']" v-on:mousedown="bringWindowToFront('YOUTUBE')">
            <div class="mover" v-if='!windowInfo["YOUTUBE"].minimized' v-on:mousedown="moverMousedown('YOUTUBE', $event)" v-on:dblclick="minimizeWindow('YOUTUBE', $event)" />
            <div class="mover" v-else v-on:mousedown="moverMousedown('YOUTUBE', $event)" v-on:dblclick="maximizeWindow('YOUTUBE', $event)" />
            <div class="closer" v-on:click="closeWindow('YOUTUBE')">
              <md-icon>clear</md-icon>
            </div>
            <div v-if='!windowInfo["YOUTUBE"].minimized' class="minimizer" v-on:click="minimizeWindow('YOUTUBE', $event)">
              <md-icon>remove</md-icon>
            </div>
            <div v-else class="minimizer" v-on:click="maximizeWindow('YOUTUBE', $event)">
              <md-icon>crop_din</md-icon>
            </div>

            <div v-if="!windowInfo['YOUTUBE'].minimized" class="resizer ne" v-on:mousedown="resizerMousedown"></div>
            <div v-if="!windowInfo['YOUTUBE'].minimized" class="resizer nw" v-on:mousedown="resizerMousedown"></div>
            <div v-if="!windowInfo['YOUTUBE'].minimized" class="resizer sw" v-on:mousedown="resizerMousedown"></div>
            <div v-if="!windowInfo['YOUTUBE'].minimized" class="resizer se" v-on:mousedown="resizerMousedown"></div>
            <YouTube class="custom-component-container md-elevation-3" />
          </div>


        </div>

        <md-button class='add-component-button md-icon-button md-raised'>+</md-button>
        <div class="add-component-button-text">{{ newComponentName }}</div>
        <md-button class='component-button dictionary-button md-icon-button md-raised' v-on:mouseup="createComponent('DICTIONARY')" v-on:mouseleave="newComponentName = ''" v-on:mouseenter="newComponentName = 'Dictionary'">D</md-button>
        <md-button class='component-button audio-button md-icon-button md-raised' v-on:mouseup="createComponent('AUDIO')" v-on:mouseleave="newComponentName = ''" v-on:mouseenter="newComponentName = 'Audio Test'">A</md-button>
        <md-button class='component-button flashcard-button md-icon-button md-raised' v-on:mouseup="createComponent('FLASHCARDS')" v-on:mouseleave="newComponentName = ''" v-on:mouseenter="newComponentName = 'Flashcards'">F</md-button>
        <md-button class='component-button easynews-button md-icon-button md-raised' v-on:mouseup="createComponent('EASYNEWS')" v-on:mouseleave="newComponentName = ''" v-on:mouseenter="newComponentName = 'Easy News'">NHK</md-button>
        <md-button class='component-button youtube-button md-icon-button md-raised' v-on:mouseup="createComponent('YOUTUBE')" v-on:mouseleave="newComponentName = ''" v-on:mouseenter="newComponentName = 'YouTube'">Y</md-button>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Dictionary from './components/Dictionary.vue'
import Audio from './components/Audio.vue'
import Flashcards from './components/FlashCards.vue'
import EasyNews from './components/EasyNews.vue'
import YouTube from './components/YouTube.vue'

export default {
  name: 'App',
  computed: {
    ...mapState({
      pageCounter: state => state.dictionary.pageCounter,
    }),
    loadingDots() {
      return '.....'.substring( 5 - this.dotCount )
    }
  },
  data() {
    return {
      loading: true,
      zIndex: 3,
      dotCount: 0,
      newComponentName: '',
      componentVisibility: {
        'AUDIO': false,
        'DICTIONARY': false,
        'FLASHCARDS': false,
        'EASYNEWS': false,
        'YOUTUBE': false,
      },
      minimizeSpots: {0: null, 1: null, 2: null, 3: null, 4: null, 5: null},
      windowInfo: {
        'AUDIO': {minimized: false, name: 'AUDIO', left: 0, top: 0, width: 0, height: 0, index: 0},
        'DICTIONARY': {minimized: false, name: 'DICTIONARY', left: 0, top: 0, width: 0, height: 0, index: 0},
        'FLASHCARDS': {minimized: false, name: 'FLASHCARDS', left: 0, top: 0, width: 0, height: 0, index: 0},
        'EASYNEWS': {minimized: false, name: 'EASYNEWS', left: 0, top: 0, width: 0, height: 0, index: 0},
        'YOUTUBE': {minimized: false, name: 'YOUTUBE', left: 0, top: 0, width: 0, height: 0, index: 0},
      },
      componentPlacementCounter: 0,
      componentFocus: '',
    }
  },
  components: {
    Dictionary, Audio, Flashcards, EasyNews, YouTube
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
    async loadingLoop() {
      let tokenizer = this.$store.state.analyzer.tokenizer;
      let kuroshiro = this.$store.state.analyzer.kuroshiro;
      let idTrie = this.$store.state.dictionary.idTrie;
      let textTrie = this.$store.state.dictionary.textTrie;
      if (tokenizer && kuroshiro && textTrie && idTrie)
        this.loading = false;
      else
        setTimeout(this.loadingLoop, 1000)
    },
    closeWindow(name) {
      let el = document.getElementById(name)
      if (this.windowInfo[name].minimized)
        this.maximizeWindow(name, el)   // Maximize the window first, updating the 'minimized' tray
      this.componentVisibility[name] = false;
    },
    // Resizes window to desired width and height, in pixels
    // Dimensions may be passed as integer or string value. In the case of string values, 'px' is suffixed, which we remove
    resizeWindow(el, width, height) {
      if (typeof width == 'string')
        el.style.width = width;
      else
        el.style['width'] = width + 'px';
      if (typeof height == 'string')
        el.style.heigh = height;
      else
        el.style['height'] = height + 'px';
    },
    // Moves window to desired location.
    // Dimensions refer to the distance from the left and top sides of the 
    // Dimensions may be passed as integer or string value. In the case of string values, 'px' is suffixed, which we remove
    moveWindow(el, left, top) {
      if (typeof left == 'string')
        el.style.left = left;
      else
        el.style.left = left + 'px';
      if (typeof top == 'string')
        el.style.top = top;
      else
        el.style.top = top + 'px'
    },
    minimizeWindow(name, e) {
      let index = Number(Object.entries(this.minimizeSpots).filter(e => (!e[1]))[0][0]);  // Find which spot to place the minimized component
      let el = (e.target.className == 'mover') ? e.originalTarget.parentElement : e.originalTarget.parentElement.parentElement;
      let newInfo = {minimized: true, name, left: el.style.left, top: el.style.top, width: el.clientWidth, height: el.clientHeight, index};
      this.windowInfo[name] = newInfo;
      this.minimizeSpots[index] = name;

      let newWindowWidth = Math.floor((window.innerWidth - 40) / 5)

      this.resizeWindow(el, newWindowWidth, 56)
      this.moveWindow(el, (newWindowWidth * index), window.innerHeight - 57)
      el.style['z-index'] = 9999;
    },
    maximizeWindow(name, e) {
      let info = this.windowInfo[name];
      let el;
      if (e.target) { // If initiated by mouseclick
        if (e.target.className == 'mover')
          el = e.target.parentElement;
        else
          el = e.target.parentElement.parentElement;
      }
      else  //  If Initiated by code (for now, only the Dictionary uses this)
        el = e;
      this.moveWindow(el, info.left, info.top);
      this.resizeWindow(el, info.width, info.height);
      el.style['z-index'] = this.zIndex++;
      this.minimizeSpots[info.index] = null;
      this.windowInfo[name].minimized = false;
      let index = info.index + 1;
      while (index < Object.keys(this.minimizeSpots).length) {
        if (this.minimizeSpots[index] == null) break;
        let elName = this.minimizeSpots[index];
        let el = document.getElementById(elName);
        let windowWidth = Math.floor((window.innerWidth - 40) / 5);
        let newLeft = (el.style.left.substring(0, el.style.left.length - 2) - windowWidth) + 'px';
        el.style.left = newLeft;
        this.windowInfo[elName].index -= 1;
        this.minimizeSpots[index - 1] = elName;
        this.minimizeSpots[index] = null;
        index++;
      }
    },
    moverMouseOver(e) {
      /*
      let [x0, y0] = [e.clientX, e.clientY];
      let [x, y] = [x0, y0];
      e.originalTarget.addEventListener('mousemove', (event) => {
        [x, y] = [event.clientX, event.clientY]
      })
      e.originalTarget.addEventListener('mouseleave', () => {
        [x, y] = [-1, -1]
      })
      setTimeout(() => {
        if (x0 == x && y0 == y) {
          e.originalTarget.nextSibling.style.visibility = 'visible'
          e.originalTarget.nextSibling.style.cursor = 'pointer'
          e.originalTarget.addEventListener('mouseleave', () => {
            e.originalTarget.nextSibling.style.visibility = 'hidden'
          })
        }
      }, 500)
      */
     e == false;
    },
    // Fired whenever a window is clicked. Br
    bringWindowToFront(name) {
      let el = document.getElementById(name);
      if (this.componentFocus != name) {
        el.style['z-index'] = this.zIndex++   // Bring component to front
        this.componentFocus = name;
      }
    },
    moverMousedown(name, e) {
      let el = e.originalTarget.parentElement
      el.parentElement.parentElement.classList.add("nohighlight");

      el.style.transition = 'all 0s ease 0s';

      window.addEventListener('mousemove', mousemove);
      window.addEventListener('mouseup', mouseup);

      let prevX = e.clientX;
      let prevY = e.clientY;

      let info = this.windowInfo
      let minimizeSpots = this.minimizeSpots

      function mousemove(e) {
        let toolbarHeight = document.getElementById('app-toolbar').clientHeight
        let newX = prevX - e.clientX;
        let newY = prevY - e.clientY;

        const rect = el.getBoundingClientRect();
        el.style.left = rect.left - newX + 'px';
        el.style.top = Math.max(rect.top - newY, toolbarHeight) + 'px';

        prevX = e.clientX;
        prevY = e.clientY;
        
        if (info[name].minimized) {  //  If component is current minimized
          el.style.width = info[name].width + 'px';
          el.style.height = info[name].height + 'px';
          minimizeSpots[info[name].index] = null;
          info[name].minimized = false;
          let index = info[name].index + 1;
          while (index < Object.keys(minimizeSpots).length) {
            if (minimizeSpots[index] == null) break;
            let elName = minimizeSpots[index];
            let el = document.getElementById(elName);
            let windowWidth = Math.floor((window.innerWidth - 40) / 5);
            let newLeft = (el.style.left.substring(0, el.style.left.length - 2) - windowWidth) + 'px';
            el.style.left = newLeft;
            info[elName].index -= 1;
            minimizeSpots[index - 1] = elName;
            minimizeSpots[index] = null;
            index++;
          }
        }
      }

      function mouseup() {
        el.style.transition = 'all .2s ease';
        el.parentElement.parentElement.classList.remove("nohighlight");
        window.removeEventListener('mousemove', mousemove)
        window.removeEventListener('mouseup', mouseup)
      }
    },
    resizerMousedown(e) {
      let el = e.originalTarget.parentElement
      el.parentElement.parentElement.classList.add("nohighlight");
      el.style.transition = 'all 0s ease';
      let currentResizer = e.target;
      window.addEventListener('mousemove', mousemove);
      window.addEventListener('mouseup', mouseup);

      let prevX = e.clientX;
      let prevY = e.clientY;

      function mousemove(e) {
        //let toolbarHeight = document.getElementById('app-toolbar').clientHeight

        const rect = el.getBoundingClientRect();

        let toolbarHeight = document.getElementById('app-toolbar').clientHeight

        if (currentResizer.classList.contains('se')) {
          el.style.width = rect.width - (prevX - e.clientX) + 'px';
          el.style.height = rect.height - (prevY - e.clientY) + 'px';
          el.style.left = rect.left + 'px';
          el.style.top = rect.top + 'px';
        }
        else if (currentResizer.classList.contains('sw')) {
          el.style.width = rect.width + (prevX - e.clientX) + 'px';
          el.style.height = rect.height - (prevY - e.clientY) + 'px';
          el.style.left = rect.left - (prevX - e.clientX) + 'px';
          el.style.top = rect.top + 'px';
        }
        else if (currentResizer.classList.contains('ne')) {
          if (rect.top > toolbarHeight - 1) {
            el.style.width = rect.width - (prevX - e.clientX) + 'px';
            el.style.height = rect.height + (prevY - e.clientY) + 'px';
            el.style.left = rect.left + 'px';
            el.style.top = Math.max(toolbarHeight + 1, rect.top - (prevY - e.clientY)) + 'px';
          }
        }
        else {    // nw
          if (rect.top > toolbarHeight - 1) {
            el.style.width = rect.width + (prevX - e.clientX) + 'px';
            el.style.height = rect.height + (prevY - e.clientY) + 'px';
            el.style.left = rect.left - (prevX - e.clientX) + 'px';
            el.style.top = Math.max(toolbarHeight + 1, rect.top - (prevY - e.clientY)) + 'px';
          }
        }

        prevX = e.clientX;
        prevY = e.clientY;
      }

      function mouseup() {
        el.style.transition = 'all .2s ease';
        el.parentElement.parentElement.classList.remove("nohighlight");
        window.removeEventListener('mousemove', mousemove)
        window.removeEventListener('mouseup', mouseup)
      }
    },

    createComponent(name) {
      if (this.componentVisibility[name]) { // Going to hide window
        this.closeWindow(name)
      }
      else {
        this.componentVisibility[name] = !this.componentVisibility[name];
        // Brings new window to the front. The timeout is needed due to the component not existing until the v-if is satisfied
        setTimeout(() => {
            document.getElementById(name).style['z-index'] = this.zIndex++;
            document.getElementById(name).style['left'] = (100 + (this.componentPlacementCounter * 100)) + 'px';
            this.componentPlacementCounter = (this.componentPlacementCounter + 1) % 6;
            document.getElementById(name).style['top'] = '120px';
          }, 1);
      }
    }
  },
  watch: {
    pageCounter: function() {
      if (!this.componentVisibility['DICTIONARY'])
        this.createComponent('DICTIONARY');
      if (this.windowInfo['DICTIONARY'].minimized) {
        setTimeout(() => {
          let el = document.getElementById('DICTIONARY')
          this.maximizeWindow('DICTIONARY', el);
        }, 1);
      }
    }
  },
  created() {
    
    this.loadingLoopDots();
    this.INIT();
    this.$store.dispatch('analyzer/INITIALIZE')
    this.loadingLoop();

   window.addEventListener('resize', () => {
     for (let item of Object.values(this.windowInfo)) {
       if (item.minimized == true) {
         document.getElementById(item.name).style.top = window.innerHeight - 57 + 'px'
         let newWindowWidth = Math.floor((window.innerWidth - 40) / 5);
         document.getElementById(item.name).style.width = newWindowWidth + 'px';
         document.getElementById(item.name).style.left = (newWindowWidth * item.index) + 'px';
       }
       else {
         let w = document.getElementById(item.name);
         if (w) {
           let [left, top] = [Number(w.style.left.replace('px', '')), Number(w.style.top.replace('px', ''))];
           let toolbar = w.children[0];
           if (left + 100 > window.innerWidth) {
             this.moveWindow(w, window.innerWidth - 100, top);
           }
           else if (top + (toolbar.clientHeight * 2) > window.innerHeight) {  // toolbar height is doubled for 'minimize' tray
             this.moveWindow(w, left, window.innerHeight - (toolbar.clientHeight * 2) - 1);
           }
         }
       }
     }
   })
  },
  beforeDestroy() {
    this.RESET();
    this.RESETDICT();
  }
}
</script>

<style>   /*  Can mix global and locally scoped CSS styling in single Vue component  */
:root{
  --dictionary-color: green !important;
  --youtube-color: red !important;
  --easynews-color: darkorange !important;
  --flashcards-color: #ae41ae !important;
  --audio-color: teal !important;
}
</style>

<style>

html body{
  height: 100%;
}

main {
  overflow: hidden !important;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 100%;
}

.main-md-content {
    border-radius: 10px;
    height: 780px;
}

.main-layout-item {
        margin-left: 5px;
        margin-right: 5px;
        border-radius: 10px;
    }

.custom-component-container{
        height: 100%;
        margin-top: 0px;
        background-color: white;
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

.resizeable{
  height: 400px;
  width: 300px;
  position: absolute;
  top: 100px;
  z-index: 2;
  transition: all 0.1s ease;
}

#md-app-content{
  padding-top: 30em;
}

.resizer {
  position: absolute;
  width: .4em;
  height: .4em;
  border-radius: 1em;
  z-index: 2;
}

.resizer.nw {
  top: -1px;
  left: -1px;
  cursor: nw-resize;
}

.resizer.ne {
  top: -1px;
  right: -1px;
  cursor: ne-resize;
}

.resizer.sw {
  bottom: -1px;
  left: -1px;
  cursor: sw-resize;
}

.resizer.se {
  bottom: -1px;
  right: -1px;
  cursor: se-resize;
}

.mover{
  position: absolute;
  height: 4em;
  width: 100%;
  z-index: 1;
}

.add-component-button{
  background-color: grey !important;
  position: absolute !important;
  z-index: 99999 !important;
  bottom: 3em;
  right: 2em;
}

.component-button{
  visibility: hidden;
  z-index: 99999 !important;
  position: absolute !important;
}

.add-component-button-text{
  color: grey;
  font-weight: bold;
  font-size: 1.2em;
  z-index: 99999 !important;
  position: absolute;
  bottom: 1.2em;
  right: .8em;
  text-align: center;
}

.add-component-button:active{
}

.add-component-button:active ~ .component-button {
  visibility: visible;
}

.dictionary-button{
  background-color:  var(--dictionary-color) !important;
  bottom: 2.5em;
  right: 6.5em;
}

.flashcard-button{
  background-color:  var(--flashcards-color) !important;
  bottom: 7.5em;
  right: 1.5em;
}

.audio-button{
  background-color:  var(--audio-color) !important;
  bottom: 6em;
  right: 5em;
}

.easynews-button{
  background-color:  var(--easynews-color) !important;
  bottom: 11.5em;
  right: 1em;
}

.youtube-button{
  background-color:  var(--youtube-color) !important;
  bottom: 10.5em;
  right: 5em;
}

.closer{
  visibility: hidden;
  position: absolute;
  margin-top: .4rem;
  margin-right: .4rem;
  top: -6px;
  right: -1px;
  width: 1.4em;
  height: 1.6em;
  cursor: pointer;
  z-index: 999;
}

.closer > i {
  font-size: 1.2em !important;
}

.mover:hover ~ *{
  visibility: visible;
}

.mover:focus-within ~ *{
  visibility: visible;
}

.closer:hover {
  visibility: visible;
}

.minimizer:hover {
  visibility: visible;
}

.minimizer{
  visibility: hidden;
  position: absolute;
  margin-top: .4rem;
  margin-right: 1.8rem;
  top: -6px;
  right: -6px;
  width: 1.6em;
  height: 1.6em;
  cursor: pointer;
  z-index: 999;
}

.minimizer > i{
  font-size: 1.2em !important;
}

.nohighlight{
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
