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
                            <v-alert ref="nombre" v-show="data.nombre" color="error" icon="$error">
                                El nombre del proyecto es necesario.
                            </v-alert>
                            <v-alert ref="encargado" v-show="data.codigo" color="error" icon="$error">
                                El nombre del encargado del proyecto es necesario.
                            </v-alert>
                            <v-alert ref="encargadov" v-show="data.enc_nom" color="error" icon="$error">
                                El nombre del encargado es invalido.
                            </v-alert>
                            <v-alert ref="carrera" v-show="data.carrera_clave" color="error" icon="$error">
                                El nombre de la carrera es necesario.
                            </v-alert>
                            <v-alert ref="carrerav" v-show="data.carr_nom" color="error" icon="$error">
                                El nombre de la carrera es invalido.
                            </v-alert>
                            <v-alert ref="fechai" v-show="data.fechainicio" color="error" icon="$error">
                                La fecha de inicio es necesaria.
                            </v-alert>
                            <v-alert ref="fechaiv" v-show="data.val_fi" color="error" icon="$error">
                                La fecha de inicio debe ser la fecha actual o una posterior.
                            </v-alert>
                            <v-alert ref="fechaf" v-show="data.fechafinal" color="error" icon="$error">
                                La fecha de fin es necesaria.
                            </v-alert>
                            <v-alert ref="fechafv" v-show="data.val_ff" color="error" icon="$error">
                                La fecha de fin debe ser posterior a la fecha de inicio y no menor a 6 meses.
                            </v-alert>
                            <v-alert ref="participantes" v-show="data.alumnos" color="error" icon="$error">
                                El número de participantes es necesario y solo debe contener números.
                            </v-alert>
                            <v-alert ref="objetivos" v-show="data.objetivos" color="error" icon="$error">
                                Los objetivos del proyecto son necesarios.
                            </v-alert>
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

import moment from 'moment';

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
        data: {
            nombre: false,
            objetivos: false,
            fechainicio: false,
            fechafinal: false,
            carrera_clave: false,
            codigo: false,
            alumnos: false,
            carr_nom: false,
            enc_nom: false,
            val_fi: false, 
            val_ff: false
        },
        encargado_nombre: "",
        carrera_nombre: "",
        carreras: [],
        encargados: [],
    }),

    watch: {
        proyecto: {
            deep: true,
            handler() {
                this.data.nombre = false
                this.data.objetivos = false
                this.data.fechainicio = false
                this.data.fechafinal = false
                this.data.carrera_clave = false
                this.data.codigo = false
                this.data.alumnos = false
                this.data.carr_nom = false
                this.data.enc_nom = false
                this.data.val_fi = false
                this.data.val_ff = false
            }
        },
    },

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
        scrollHaciaAlerta(elemento) {
            if (elemento && elemento.$el) {
                const offset = elemento.$el.offsetTop;
                window.scrollTo({
                    top: offset,
                    behavior: "smooth", // Esto hace que el desplazamiento sea suave
                });
            }
        },
        async guardar() {
            const hoy = new Date();
            const año = hoy.getFullYear();
            const mes = String(hoy.getMonth() + 1).padStart(2, '0');
            const dia = String(hoy.getDate()).padStart(2, '0');
            const fecha = `${año}-${mes}-${dia}`;
            try {
                if (this.proyecto.nombre === "") {
                    this.data.nombre = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.nombre);
                    });
                    return
                }
                if (this.proyecto.objetivos === "") {
                    this.data.objetivos = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.objetivos);
                    });
                    return
                }
                if (this.proyecto.fechainicio === "") {
                    this.data.fechainicio = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.fechai);
                    });
                    return
                }
                var date = moment(this.proyecto.fechainicio).format("yyyy-MM-DD")
                if(date < fecha){
                    this.data.val_fi = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.fechaiv);
                    });
                    return
                }
                if (this.proyecto.fechafinal === "") {
                    this.data.fechafinal = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.fechaf);
                    });
                    return
                }
                var date2 = moment(date).add(6, "M");
                var date3 = moment(date2).format("yyyy-MM-DD")
                var date4 = moment(this.proyecto.fechafinal).format("yyyy-MM-DD")
                if (date4 < date3) {
                    this.data.val_ff = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.fechafv);
                    });
                    return
                }
                if (this.proyecto.alumnos === "") {
                    this.data.alumnos = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.participantes);
                    });
                    return
                }
                if (isNaN(Number(this.proyecto.alumnos))) {
                    this.data.alumnos = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.participantes);
                    });
                    return
                }
                if (this.encargado_nombre === "") {
                    this.data.codigo = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.encargado);
                    });
                    return
                }
                if (this.carrera_nombre === "") {
                    this.data.carrera_clave = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.carrera);
                    });
                    return
                }
                try{
                    const resCar = await this.$axios.get(`/Carreras/Nombre/${this.carrera_nombre}`)
                    const Carrera = resCar.data.data
                    this.proyecto.carrera_clave = Carrera.clave
                    try{
                        const resEnca = await this.$axios.get(`/Maestros/Nombre/${this.encargado_nombre}`)
                        const Encargado = resEnca.data.data
                        this.proyecto.codigo = Encargado.codigo
                        try{
                            const response = await this.$axios.post('/proyectos', this.proyecto)
                            this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                            this.$router.push('/proyectos')
                        } catch (error) {
                            this.$nuxt.$emit('show-snackbar', 'red', error.message)
                        }
                    } catch (error) {
                        this.data.enc_nom = true
                        this.$nextTick(() => {
                            this.scrollHaciaAlerta(this.$refs.encargadov);
                        });
                        return
                    }
                } catch (error) {
                    this.data.carr_nom = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.carrerav);
                    });
                    return
                }
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