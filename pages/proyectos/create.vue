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
            <v-form @submit.prevent="guardar" class="custom-v-form">
                <v-card>
                    <v-card-title>
                        <b>Crear proyecto</b>
                    </v-card-title>
                    <v-card-text>
                        <v-form>
                            <v-row>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="proyecto.nombre" outlined label="Nombre"
                                    :rules="[$validations.notEmpty]"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text v-if="roles.rol === 'maestro'" outlined>Encargado <br></v-text>
                                    <v-text v-if="roles.rol === 'maestro'" outlined style="font-size: larger;">{{ encargado_nombre }}</v-text>
                                    <v-combobox v-if="roles.rol === 'administrador'" outlined v-model="encargado_nombre" label="Encargado"
                                    :items="encargados" :rules="[$validations.notEmpty]"></v-combobox>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-combobox v-model="carrera_nombre" outlined label="Carrera" :items="carreras"
                                    :rules="[$validations.notEmpty]"></v-combobox>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="proyecto.fechainicio" outlined label="Fecha de inicio" type="date"
                                    :rules="[$validations.notEmpty]"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="proyecto.fechafinal" outlined label="Fecha final" type="date"
                                    :rules="[$validations.notEmpty]"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="proyecto.alumnos" outlined label="Alumnos solicitados" type="integer"
                                    :rules="[$validations.notEmpty]"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="8">
                                    <v-textarea outlined class="textarea-custom" v-model="proyecto.objetivos" label="Objetivos"
                                    :rules="[$validations.notEmpty]"></v-textarea>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn dark rounded @click="cancelar()" color="red">
                            <v-icon>
                                mdi-cancel
                            </v-icon>
                            Cancelar
                        </v-btn>
                        <v-btn dark rounded type="submit" color="green">
                            <v-icon>
                                mdi-checkbox-marked-circle
                            </v-icon>
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

<style>
.custom-v-form {
    margin-top: 0px;
    padding: 20px;
    background-color: #66BB6A;
    box-shadow: 0 0 20px black;
}
.textarea-custom .v-label::before {
    content: unset;
    transform: translateY(-10px);
    /* Ajusta la posición vertical del label */
    font-size: 14px;
    /* Ajusta el tamaño de fuente del label */
}
</style>