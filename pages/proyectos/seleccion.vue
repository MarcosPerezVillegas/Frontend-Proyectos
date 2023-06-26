<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-card>
                <v-card-title>
                    {{proyecto.nombre}}
                </v-card-title>
                <v-card-text>
                    {{proyecto.objetivos}}
                    <v-spacer />
                    {{proyecto.carrera_clave}}
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="cancelar()" color="red">
                        Cancelar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
</template>

<script lang="ts">

export default {
    name: 'ProyectosUpdate',
    middleware: 'auth',
    data: () => ({
        proyecto: {
            id: "",
            nombre: "",
            objetivos: "",
            fechainicio: "",
            fechafinal: "",
            carrera_clave: "",
        }
    }),

    async beforeMount() {
        const id = localStorage.getItem('proId')
        
        try {
            const response = await this.$axios.get(`/proyectos/${id}`)
            this.proyecto = response.data.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        cancelar() {
            this.$router.push('/proyectos')
        }
    }
}

</script>