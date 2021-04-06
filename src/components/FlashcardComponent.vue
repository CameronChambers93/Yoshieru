<template>
    <div v-html="_html">
    </div>
</template>

<script>

    export default {
        props: {
            _html: {
                default: "",
                type: String
            }
        },

        created() {
        },

        methods: {
        }
    }

</script>
