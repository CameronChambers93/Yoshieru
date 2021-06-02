<template lang="html">
    <div class="grid-container">
        <div class="toolbar">
            <md-icon>hearing</md-icon>
        </div>

        <div class="main-content" v-if="page" v-bind:html="page">          
                
        </div>
    </div>
</template>

<script>
import axios from 'axios';
    export default {
        components: {
            
        },
        
        props: {
            
        },
        created () {
            axios(this.endpoint + "/youtube").then(results => {
                console.log(results);
                this.page = results;
            })
        },

        data() {
            return {
                page: null,
                endpoint: 'http://ec2-100-25-211-104.compute-1.amazonaws.com:5000/api',
            }
        },

        computed: {
            
        },

        methods: {
            
        }
    }
</script>

<style lang="scss" scoped>  

    .furigana-component {
        font-size:24px;
        margin-bottom: 10px;
        width: 100%;
        text-align: center;
    }

    .answer-content {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .main-content {
        color: black;
        border-bottom-left-radius: 2em;
        border-bottom-right-radius: 2em;
        background-color: white !important;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        overflow: auto;
        scrollbar-width: none;  /* FireFox */
        -ms-overflow-style: none; /* IE 10+ */
        ::-webkit-scrollbar { 
        display: none; /* Chrome Safari */
    }
    }

    .grid-container{
        display: grid;
        grid-template-rows: 4em auto
    }

    .toolbar {
        display: flex;
        background-color: var(--youtube-color) !important;
        text-align: center;
        border-radius: 10px 10px 0px 0px;
        align-items: center;
        justify-content: center;
    }
</style>
