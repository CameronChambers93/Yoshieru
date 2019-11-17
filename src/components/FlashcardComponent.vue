<template>
    <div>
        {{ html }}
    </div>
</template>

<script>

    export default {
        props: {
            html: "",
            type: String
        },

        created() {
        },

        methods: {
            emitGlobalGetEntry(id) {
                this.$eventHub.$emit('globalGetEntry', id);
            }
        }
    }

</script>
