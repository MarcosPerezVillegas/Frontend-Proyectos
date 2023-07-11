<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-card>
                <v-card-title>
                    Entrega de tarea
                </v-card-title>
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
    name: 'ProyectosSelect',
    middleware: 'auth',
    data: () => ({
        roles: {},
        proyecto: {},
        maestro: "",
        carrera: ""
    }),

    async beforeMount() {
        this.$store.commit('setTitle', 'Proyectos')
        const id = localStorage.getItem('proId')
        
        try {
            const response = await this.$axios.get(`/proyectos/${id}`)
            this.proyecto = response.data.data
            this.carrera = this.proyecto.Carrera.nombre
            this.maestro = this.proyecto.encargado.nombre
            const responseR = await this.$axios.get('/login')
            this.roles = responseR.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        cancelar() {
            this.$router.push('/proyectos/datos')
        }
    }
}

</script>