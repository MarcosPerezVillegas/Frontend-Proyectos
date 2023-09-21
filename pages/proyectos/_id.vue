<template>
    <v-container>
        <v-container v-if="rol === 'alumno'" justify-center align-center>
            <v-form class="custom-v-form">
                <v-card>
                    <v-card-title class="headline"><b>Acceso denegado</b></v-card-title>
                    <v-card-text>
                        <b>No tienes el rol necesario para acceder a esta página.</b>
                    </v-card-text>
                </v-card>
            </v-form>
        </v-container>
        <v-container v-else>
            <v-form @submit.prevent="guardar" class="custom-v-form">
                <v-card>
                    <v-card-title class="headline">
                        <b>Editar proyecto</b>
                    </v-card-title>
                    <v-card-text>
                        <v-form>
                            <v-alert ref="nombre" v-show="data.nombre" color="error" icon="$error">
                                El nombre del proyecto es necesario.
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
                                    <v-combobox v-model="carrera_nombre" outlined label="Carrera" :items="carreras"
                                        :rules="[$validations.notEmpty]"></v-combobox>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="proyecto.alumnos" outlined label="Cupos"
                                        :rules="[$validations.notEmpty]"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="proyecto.fechainicio" outlined label="Fecha de inicio"
                                        type="date" :rules="[$validations.notEmpty]"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="proyecto.fechafinal" outlined label="Fecha final" type="date"
                                        :rules="[$validations.notEmpty]"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="8">
                                    <v-textarea v-model="proyecto.objetivos" outlined class="textarea-custom"
                                        label="Objetivos" :rules="[$validations.notEmpty]"></v-textarea>
                                </v-col>
                            </v-row>
                            <v-row justify="center">
                                <v-btn dark rounded @click="cancelar()" color="red">
                                    <v-icon>
                                        mdi-cancel
                                    </v-icon>
                                    Cancelar
                                </v-btn>
                                <v-btn dark rounded @click="guardar()" color="blue">
                                    <v-icon>
                                        mdi-checkbox-marked-circle
                                    </v-icon>
                                    Guardar
                                </v-btn>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-form>
        </v-container>
    </v-container>
</template>

<script lang="ts">

// @ts-nocheck

import moment from 'moment';

export default {
    name: 'ProyectosUpdate',
    middleware: 'auth',
    data: () => ({
        rol: "",
        proyecto: {
            nombre: "",
            objetivos: "",
            fechainicio: "",
            fechafinal: "",
            carrera_clave: "",
            alumnos: "",
        },
        data: {
            nombre: false,
            objetivos: false,
            fechainicio: false,
            fechafinal: false,
            carrera_clave: false,
            alumnos: false,
            carr_nom: false,
            val_fi: false,
            val_ff: false
        },
        carrera_nombre: "",
        carreras: [],
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
                this.data.alumnos = false
                this.data.carr_nom = false
                this.data.val_fi = false
                this.data.val_ff = false
            }
        },
    },

    async beforeMount() {
        const id = this.$route.params.id

        try {
            const responseR = await this.$axios.get('/login')
            this.rol = responseR.data.rol
            if (this.rol === 'alumno') { return }
            const response = await this.$axios.get(`/proyectos/${id}`)
            this.proyecto = response.data.data
            this.carrera_nombre = this.proyecto.Carrera.nombre
            this.cargarCarreras()
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
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
                if (date < fecha) {
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
                if (this.carrera_nombre === "") {
                    this.data.carrera_clave = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.carrera);
                    });
                    return
                }
                try {
                    const resCar = await this.$axios.get(`/Carreras/Nombre/${this.carrera_nombre}`)
                    const Carrera = resCar.data.data
                    this.proyecto.carrera_clave = Carrera.clave
                    try {
                        const response = await this.$axios.put(`/proyectos/${this.proyecto.id}`, this.proyecto)
                        this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                        this.$router.push('/proyectos')
                    } catch (error) {
                        this.$nuxt.$emit('show-snackbar', 'red', error.message)
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