<template>
    <a class="container" :style="{'background-color': color}" :title=tooltip>
        {{ text }}
    </a>
</template>
<script>
import tagDict from '../../assets/tagDict.json'

export default {
    props: {
        text: {
            default: '',
            type: String
        },
    },
    computed: {
        color: function() {
            let num = 21347;
            for (let c in this.text) {
                num *= this.text.charCodeAt(c);
            }
            num >>>= 0;
            var b = num & 0xFF,
                g = (num & 0xFF00) >>> 8,
                r = (num & 0xFF0000) >>> 16
            return "rgb(" + [r, g, b].join(",") + ")";
        },
        tooltip: function() {
            return tagDict[this.text];
        }
    },
}
</script>
<style scoped>

.container{
    color: white !important;
    text-align: center;
    font-size: .8em;
    padding: 0 .4em;
    border-radius: .4em;
    height: 80%;
    justify-content: center;
    align-items: center;
    align-content: center;
    display: flex;
    cursor: default;
    text-decoration: none !important;
}

.container:link{
    color: white
}
</style>