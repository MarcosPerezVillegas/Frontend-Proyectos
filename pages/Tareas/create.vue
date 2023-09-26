<template>
    <v-container>
        <v-container v-if="load">
            <v-form class="custom-v-form-create">
                <v-card>
                    <v-card-title class="headline"><b>Cargando...</b></v-card-title>
                    <v-card-text>
                        <b>Por favor espere...</b>
                    </v-card-text>
                </v-card>
            </v-form>
        </v-container>
        <v-container v-else-if="rol === 'alumno'" justify-center align-center>
            <v-form class="custom-v-form-create">
                <v-card>
                    <v-card-title class="headline"><b>Acceso denegado</b></v-card-title>
                    <v-card-text>
                        <b>No tienes el rol necesario para acceder a esta página.</b>
                    </v-card-text>
                </v-card>
            </v-form>
        </v-container>
        <v-container v-else>
            <v-form @submit.prevent="validarTamañoArchivo()" class="custom-v-form-create" style="border-radius: 2%;">
                <v-card>
                    <v-card-title class="headline">
                        <b>Crear una tarea</b>
                    </v-card-title>
                    <v-card-text>
                        <v-alert ref="nombre" v-show="data.nombre" color="error" icon="$error">
                            El nombre de la tarea es obligatorio.
                        </v-alert>

                        <v-alert ref="fecha" v-show="data.fecha" color="error" icon="$error">
                            La fecha de entrega de la tarea es obligatoria.
                        </v-alert>

                        <v-alert ref="fechaC" v-show="data.val_fi" color="error" icon="$error">
                            La fecha de entrega debe ser posterior o igual a la fecha actual
                            y no puede ser posterior a la fecha de entrega final del proyecto ({{ dateE }}).
                        </v-alert>

                        <v-alert ref="hora" v-show="data.hora" color="error" icon="$error">
                            La hora de entrega de la tarea es obligatoria.
                        </v-alert>

                        <v-row>
                            <v-col cols="12" md="4">
                                <v-text-field v-model="tarea.nombre" outlined label="Nombre"
                                    :rules="[$validations.notEmpty]"></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-text-field v-model="tarea.fecha_limite" outlined label="Fecha limite" type="date"
                                    :rules="[$validations.notEmpty]"></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-text-field v-model="tarea.hora_limite" outlined label="Hora limite" type="time"
                                    :rules="[$validations.notEmpty]"></v-text-field>
                            </v-col>
                        </v-row>

                        <v-alert ref="descripcion" v-show="data.descripcion" color="error" icon="$error">
                            La descripcion de la tarea es obligatoria.
                        </v-alert>

                        <v-textarea v-model="tarea.descripcion" outlined class="textarea-custom" label="Descripcion"
                            :rules="[$validations.notEmpty]"></v-textarea>

                        <v-textarea v-model="tarea.comentarios" outlined class="textarea-custom"
                            label="Comentarios del profesor"></v-textarea>

                        <v-alert ref="file" v-show="data.file" color="error" icon="$error">
                            El archivo no debe superar los 50mb.
                        </v-alert>

                        <v-card outlined
                            style="margin-top: 0px; padding: 20px; background-color: whitesmoke; box-shadow: 0 0 2px black;">
                            <v-text style="font-size: larger;">Subir material de apoyo.</v-text>
                            <br>
                            <v-text style="font-size: small; font-style: oblique;">No mayor a 50mb.</v-text>
                            <v-file-input v-model="archivo" label="Seleccionar archivo"
                                :rules="[$validations.isFileLessThan50MB]"></v-file-input>
                        </v-card>
                        <br>
                        <v-alert ref="estado" v-show="data.activo" color="error" icon="$error">
                            El estado de la tarea en obligatorio.
                        </v-alert>

                        <v-combobox v-model="estado" outlined label="Estado de la tarea" :items="['Activa', 'Oculta']"
                            :rules="[$validations.notEmpty]"></v-combobox>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn dark rounded class="white--text" color="#FF0000" @click="cancelar()">
                            <v-icon small>
                                mdi-cancel
                            </v-icon>
                            Cancelar
                        </v-btn>
                        <v-btn dark rounded class="white--text" type="submit" color="#43B63B">
                            <v-icon small>
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
import { clave } from '@/plugins/globals';
const CryptoJS = require("crypto-js");
export default {
    name: 'UsuariosCreate',


    data: () => ({
        load: true,
        rol: "",
        archivo: null,
        tarea: {
            Proyecto_id: "",
            nombre: "",
            descripcion: "",
            comentarios: "",
            fecha_limite: "",
            hora_limite: "",
            activo: Number
        },
        proyecto: {},
        data: {
            nombre: false,
            descripcion: false,
            fecha: false,
            hora: false,
            activo: false,
            file: false,
            val_fi: false,
        },
        dateE: "",
        tareas: [],
        tareaId: 0,
        estado: ""
    }),

    watch: {
        tarea: {
            deep: true,
            handler() {
                this.data.nombre = false
                this.data.descripcion = false
                this.data.fecha = false
                this.data.hora = false
                this.data.activo = false
                this.data.val_fi = false
            }
        },
        estado: {
            deep: true,
            handler() {
                this.data.activo = false
            }
        },
        archivo: {
            deep: true,
            handler() {
                this.data.file = false
            }
        }
    },

    async beforeMount() {
        try {
            const res = await this.$axios.get('/Login')
            this.rol = res.data.rol
            if (this.rol === 'alumno') {
                this.load = false
                return
            }
            await this.$axios.get(`/Proyectos/Usuario/${res.data.codigo}`)
            const id = localStorage.getItem("ProId")
            const bytes = CryptoJS.AES.decrypt(id, clave);
            this.tarea.Proyecto_id = bytes.toString(CryptoJS.enc.Utf8);
            const resp = await this.$axios.get(`/Proyectos/${this.tarea.Proyecto_id}`)
            this.proyecto = resp.data.data
            this.load = false
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

        async validarTamañoArchivo() {
            // Verificar si se ha seleccionado un archivo
            if (this.archivo) {
                const tamañoMaximo = 50 * 1024 * 1024; // 50 MB (ajusta según tus necesidades)
                if (this.archivo.size > tamañoMaximo) {
                    this.data.file = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.file);
                    });
                    return
                }
            }
            try {
                if (this.tarea.nombre === "") {
                    this.data.nombre = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.nombre);
                    });
                    return
                }
                if (this.tarea.fecha_limite === "") {
                    this.data.fecha = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.fecha);
                    });
                    return
                }
                if (this.tarea.hora_limite === "") {
                    this.data.hora = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.hora);
                    });
                    return
                }
                const hoy = new Date();
                const año = hoy.getFullYear();
                const mes = String(hoy.getMonth() + 1).padStart(2, '0');
                const dia = String(hoy.getDate()).padStart(2, '0');
                const fecha = `${año}-${mes}-${dia}`;
                const date = moment(this.tarea.fecha_limite).format("yyyy-MM-DD")
                this.dateE = moment(this.proyecto.fechafinal).format("yyyy-MM-DD")
                console.log(this.proyecto.fechafinal)
                console.log(this.tarea.fecha_limite)
                if (date < fecha || this.dateE < this.tarea.fecha_limite) {
                    this.data.val_fi = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.fechaC);
                    });
                    return
                }
                if (this.tarea.descripcion === "") {
                    this.data.descripcion = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.descripcion);
                    });
                    return
                }
                if (this.estado === "") {
                    this.data.activo = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.activo);
                    });
                    return
                }
                const resTar = await this.$axios.get(`/Tareas`)
                this.tareas = resTar.data.data
                for (const tarea of this.tareas) {
                    if (tarea.Proyecto_id.toString() === this.tarea.Proyecto_id && tarea.nombre === this.tarea.nombre) {
                        return this.$nuxt.$emit('show-snackbar', 'red', "Ya existe una tarea con ese nombre")
                    }
                }
            } catch { }
            this.guardar()
        },
        async enviarArchivo() {
            const formData = new FormData()
            formData.append('archivo', this.archivo)
            try {
                const response = await this.$axios.post(`Tarea/Entrega/Material/${this.tareaId}/${this.tarea.Proyecto_id}`, formData)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
            this.$router.push('/Tareas')
        },

        async guardar() {
            try {
                if (this.estado === "Activa") {
                    this.tarea.activo = 1
                } else {
                    this.tarea.activo = 0
                }

                const response = await this.$axios.post('/Tareas', this.tarea)
                this.tareaId = response.data.data.id;
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                this.enviarArchivo()
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        },

        cancelar() {
            this.$router.push('/Tareas')
        },
    }

}

</script>

<style>
.custom-v-form-create {
    margin-top: 0px;
    padding: 20px;
    background-color: #e1fffd;
    box-shadow: 0 0 20px black;
    border-radius: 10px;
}

.textarea-custom .v-label::before {
    content: unset;
    transform: translateY(-10px);
    /* Ajusta la posición vertical del label */
    font-size: 14px;
    /* Ajusta el tamaño de fuente del label */
}
</style>