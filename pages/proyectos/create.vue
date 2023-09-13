<template>
    <v-container>
        <v-container v-if="roles.rol === 'alumno'" justify-center align-center>
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
                        Crear proyecto
                    </v-card-title>
                    <v-card-text>
                        <v-text-field v-model="proyecto.nombre" outlined label="Nombre"
                            :rules="[$validations.notEmpty]"></v-text-field>
                        <v-textarea v-model="proyecto.objetivos" outlined label="Objetivos" style="overflow-y: auto; max-block-size: 300px;"
                            :rules="[$validations.notEmpty]"></v-textarea>
                        <v-text-field v-model="proyecto.fechainicio" outlined label="Fecha de inicio" type="date"
                            :rules="[$validations.notEmpty]"></v-text-field>
                        <v-text-field v-model="proyecto.fechafinal" outlined label="Fecha final" type="date"
                            :rules="[$validations.notEmpty]"></v-text-field>
                        <v-text v-if="roles.rol === 'maestro'" outlined>Encargado</v-text><br>
                        <v-text v-if="roles.rol === 'maestro'" outlined style="font-size: larger;">{{ encargado_nombre }}</v-text>
                        <v-combobox v-if="roles.rol === 'administrador'" outlined v-model="encargado_nombre" label="Encargado"
                            :items="encargados" :rules="[$validations.notEmpty]"></v-combobox>
                        <v-text-field v-model="proyecto.alumnos" outlined label="Alumnos solicitados" type="integer"
                            :rules="[$validations.notEmpty]"></v-text-field>
                        <v-combobox v-model="carrera_nombre" outlined label="Carrera" :items="carreras"
                            :rules="[$validations.notEmpty]"></v-combobox>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn @click="cancelar()" color="red">
                            Cancelar
                        </v-btn>
                        <v-btn type="submit" color="green">
                            Guardar
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
    name: 'ProyectosCreate',
    middleware: 'auth',

    data: () => ({
        roles: {},
        proyecto: {
            nombre: "",
            objetivos: "",
            fechainicio: "",
            fechafinal: "",
            carrera_clave: "",
            codigo: "",
            alumnos: ""
        },
        encargado_nombre: "",
        carrera_nombre: "",
        carreras: [],
        encargados: [],
    }),

    async beforeMount() {
        try {
            const response = await this.$axios.get('/login')
            this.roles = response.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }

        this.cargarEncargados()
        this.cargarCarreras()
    },


    methods: {
        async guardar() {
            if (this.proyecto.nombre === "" || this.proyecto.objetivos === "" || this.carrera_nombre === "" ||
                this.proyecto.fechainicio === "" || this.proyecto.fechafinal === "" || this.proyecto.alumnos === "") {
                return this.$nuxt.$emit('show-snackbar', 'red', "Llena los espacios requeridos")
            }
            try {
                const resEnca = await this.$axios.get(`/Maestros/Nombre/${this.encargado_nombre}`)
                const Encargado = resEnca.data.data
                this.proyecto.codigo = Encargado.codigo
                const resCar = await this.$axios.get(`/Carreras/Nombre/${this.carrera_nombre}`)
                const Carrera = resCar.data.data
                this.proyecto.carrera_clave = Carrera.clave
                const response = await this.$axios.post('/proyectos', this.proyecto)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                this.$router.push('/proyectos')
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        },
        cancelar() {
            this.$router.push('/proyectos')
        },
        async getEncargados() {
            try {
                const response = await this.$axios.get('/Maestros')
                const responseA = await this.$axios.get(`/Maestros/Admins`)
                const Maestros = response.data.data
                const Admins = responseA.data.data
                const usuarios = [...Admins, ...Maestros]

                const encargadosItems = usuarios.map(usuario => usuario.nombre)
                return encargadosItems
            } catch (error) {
                return []

            }
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
        async cargarEncargados() {
            try {
                const responseA = await this.$axios.get(`/maestros/${this.roles.codigo}`)
                const usuarios = responseA.data.data
                this.encargado_nombre = usuarios.nombre
                this.encargados = await this.getEncargados();
            } catch (error) {
                this.encargados = [];
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