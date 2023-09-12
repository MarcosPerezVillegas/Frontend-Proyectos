<template>
    <v-container>
        <v-container v-if="rol === 'alumno'" justify-center align-center>
            <v-card>
                <v-card-title>Acceso Denegado</v-card-title>
                <v-card-text>
                    <p>No tienes el rol necesario para acceder a esta página.</p>
                </v-card-text>
            </v-card>
        </v-container>
        <v-container v-else>
            <v-form @submit.prevent="guardar">
                <v-card>
                    <v-card-title>
                        Editar proyecto
                    </v-card-title>
                    <v-card-text>
                        <v-text-field v-model="proyecto.id" outlined label="ID"></v-text-field>
                        <v-text-field v-model="proyecto.nombre" outlined label="Nombre"></v-text-field>
                        <v-textarea v-model="proyecto.objetivos" outlined style="overflow-y: auto; max-block-size: 300px; " label="Objetivos"></v-textarea>
                        <v-text-field v-model="proyecto.fechainicio" outlined label="Fecha de inicio" type="date"></v-text-field>
                        <v-text-field v-model="proyecto.fechafinal" outlined label="Fecha final" type="date"></v-text-field>
                        <v-text-field v-model="proyecto.alumnos" outlined label="Cupos"></v-text-field>
                        <v-combobox v-model="carrera_nombre" outlined label="Carrera" :items="carreras"></v-combobox>
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
    </v-container>
</template>

<script lang="ts">

// @ts-nocheck

export default {
    name: 'ProyectosUpdate',
    middleware: 'auth',
    data: () => ({
        rol: "",
        proyecto: {
            id: "",
            nombre: "",
            objetivos: "",
            fechainicio: "",
            fechafinal: "",
            carrera_clave: "",
            alumnos: "",
        },
        carrera_nombre: "",
        carreras: [],
    }),

    async beforeMount() {
        const id = this.$route.params.id

        try {
            const responseR = await this.$axios.get('/login')
            this.rol = responseR.data.rol
            console.log(this.rol)
            const response = await this.$axios.get(`/proyectos/${id}`)
            this.proyecto = response.data.data
            this.carrera_nombre = this.proyecto.Carrera.nombre
            this.cargarCarreras()
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        async guardar() {
            try {
                const resCar = await this.$axios.get(`/Carreras/Nombre/${this.carrera_nombre}`)
                const Carrera = resCar.data.data
                this.proyecto.carrera_clave = Carrera.clave
                const response = await this.$axios.put(`/proyectos/${this.proyecto.id}`, this.proyecto)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                this.$router.push('/proyectos')
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        },
        cancelar() {
            this.$router.push('/proyectos')
        },
        async getCarreras() {
            try {
                const response = await this.$axios.get('/Carreras')
                const carreras = response.data.data
                const carrerasItems = carreras.map(car => car.nombre)
                return carrerasItems
            } catch (error) {
                return []

            }
        },
        async cargarCarreras() {
            try {
                this.carreras = await this.getCarreras();
            } catch (error) {
                this.carreras = [];
            }
        }
    }
}

</script>

<style>
.expansible-text-field {
  resize: vertical; /* Permite redimensionar verticalmente */
  min-height: 50px; /* Establece la altura mínima */
  max-height: 300px; /* Establece la altura máxima (ajusta según tus necesidades) */
  overflow-y: auto; /* Agrega una barra de desplazamiento vertical si es necesario */
}
</style>