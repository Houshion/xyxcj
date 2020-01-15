<template>

</template>

<script>
    export default {
        name: 'index',
        data() {
            return {}
        },

        created() {
             this.$router.replace({path:this.$route.query.from})
        },
        methods: {}
    }
</script>

<style scoped>

</style>
