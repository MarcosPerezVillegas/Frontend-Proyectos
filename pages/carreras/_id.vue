<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-card>
                <v-card-title>
                    Editar usuario
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="carrera.clave" label="Clave"></v-text-field>
                    <v-text-field v-model="carrera.nombre" label="Nombre"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="red" to="/Carreras">
                        Cancelar
                    </v-btn>
                    <v-btn color="green" type="submit">
                        Guardar
                    </v-btn>
                    
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
</template>

<script lang="ts">

export default {
    name: 'UsuariosUpdate',
    middleware: 'auth',
    data: () => ({
        clave: "",
        carrera: {
            clave: "",
            nombre: "",
        },
    }),

    async beforeMount() {
        this.clave = this.$route.params.id
        
        try {
            const response = await this.$axios.get(`/Carreras/${this.clave}`)

            this.carrera = response.data.data
        } catch (error) {   
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        async guardar() {
            try {
                const response = await this.$axios.put(`/Carreras/${this.clave}`, this.carrera)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                this.$router.push('/Carreras')
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        },
    }
}

</script>