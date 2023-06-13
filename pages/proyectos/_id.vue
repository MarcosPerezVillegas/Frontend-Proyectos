<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-card>
                <v-card-title>
                    Editar proyecto
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="proyecto.id" label="ID"></v-text-field>
                    <v-text-field v-model="proyecto.nombre" label="Nombre"></v-text-field>
                    <v-text-field v-model="proyecto.objetivos" label="Objetivos"></v-text-field>
                    <v-text-field v-model="proyecto.fechainicio" label="Fecha de inicio"></v-text-field>
                    <v-text-field v-model="proyecto.fechafinal" label="Fecha final"></v-text-field>
                    <v-text-field v-model="proyecto.usuario_codigo" label="Encargado"></v-text-field>
                    <v-text-field v-model="proyecto.carrera_clave" label="Carrera"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn type="submit">
                        Guardar
                    </v-btn>
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
            usuario_codigo: "",
            carrera_clave: "",
        }
    }),

    async beforeMount() {
        const id = this.$route.params.id
        
        try {
            const response = await this.$axios.get(`/proyectos/${id}`)

            this.proyecto = response.data.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        async guardar() {
            try {
                const response = await this.$axios.put(`/proyectos/${this.proyecto.id}`, this.proyecto)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                this.$router.push('/proyectos')
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        },
        cancelar() {
            this.$router.push('/proyectos')
        }
    }
}

</script>