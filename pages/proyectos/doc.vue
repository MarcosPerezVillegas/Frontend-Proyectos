<script lang="ts">

export default {
    async beforeMount() {
        
        try {
            const response = await this.$axios.get(`/documentos/Exel`)

            this.proyecto = response.data.data
            this.$router.push('/proyectos')
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },
}

</script>