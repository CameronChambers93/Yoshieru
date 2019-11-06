<template>
    <div>
        {{ html }}
    </div>
</template>

<script>

    export default {
        props:
            ['html'],

        created() {
        },

        methods: {
            emitGlobalGetEntry(id) {
                this.$eventHub.$emit('globalGetEntry', id)
            }
        }
    }

</script>
