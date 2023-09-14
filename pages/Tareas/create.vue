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
            <v-form @submit.prevent="validarTamañoArchivo()">
                <v-card>
                    <v-card-title>
                        Crear una tarea
                    </v-card-title>
                    <v-card-text>
                        <v-text-field v-model="tarea.nombre" outlined label="Nombre"
                            :rules="[$validations.notEmpty]"></v-text-field>
                        <v-textarea v-model="tarea.descripcion" outlined style="overflow-y: auto; max-block-size: 300px; "
                            label="Descripcion" :rules="[$validations.notEmpty]"></v-textarea>
                        <v-textarea v-model="tarea.comentarios" outlined style="overflow-y: auto; max-block-size: 300px; "
                            label="Comentarios del profesor"></v-textarea>
                        <v-text-field v-model="tarea.fecha_limite" outlined label="Fecha limite" type="date"
                            :rules="[$validations.notEmpty]"></v-text-field>
                        <v-text-field v-model="tarea.hora_limite" outlined label="Hora limite" type="time"
                            :rules="[$validations.notEmpty]"></v-text-field>
                        <v-card outlined>
                            <v-text style="font-size: larger;">Subir material de apoyo</v-text>
                            <br>
                            <v-text style="font-size: small; font-style: oblique;">No mayor a 50mb</v-text>
                            <v-file-input v-model="archivo" label="Seleccionar archivo"></v-file-input>
                        </v-card>
                        <br>
                        <v-combobox v-model="estado" outlined label="Estado de la tarea" :items="['Activa', 'Oculta']"
                            :rules="[$validations.notEmpty]"></v-combobox>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn @click="cancelar()">
                            Cancelar
                        </v-btn>
                        <v-btn type="submit">
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
import { clave } from '@/plugins/globals';
const CryptoJS = require("crypto-js");
export default {
    name: 'UsuariosCreate',


    data: () => ({
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
        tareas: [],
        tareaId: 0,
        estado: ""
    }),
    async beforeMount() {
        try {
            const res = await this.$axios.get('/Login')
            this.rol = res.data.rol
            await this.$axios.get(`/Proyectos/Usuario/${res.data.codigo}`)
            const id = localStorage.getItem("ProId")
            const bytes = CryptoJS.AES.decrypt(id, clave);
            this.tarea.Proyecto_id = bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },
    methods: {
        async validarTamañoArchivo() {
            // Verificar si se ha seleccionado un archivo
            if (this.archivo) {
                const tamañoMaximo = 50 * 1024 * 1024; // 50 MB (ajusta según tus necesidades)
                if (this.archivo.size > tamañoMaximo) {
                    this.$nuxt.$emit('show-snackbar', 'red', 'El archivo seleccionado es demasiado grande. Por favor, elige un archivo más pequeño.');
                    this.archivo = null; // Limpia el archivo seleccionado
                }
            }
            try {
                if (this.tarea.nombre === "" || this.tarea.descripcion === "" ||
                    this.tarea.fecha_limite === "" || this.tarea.hora_limite === "" || this.estado === "") {
                    return this.$nuxt.$emit('show-snackbar', 'red', "Llena los espacios requeridos")
                }
                const resTar = await this.$axios.get(`/Tareas`)
                this.tareas = resTar.data.data
                for (const tarea of this.tareas) {
                    if (tarea.Proyecto_id.toString() === this.tarea.Proyecto_id && tarea.nombre === this.tarea.nombre) {
                        return this.$nuxt.$emit('show-snackbar', 'red', "Ya existe una tarea con ese nombre")
                    }
                }
                if (this.tareas.length !== 0) {
                    this.tareaId = this.tareas[this.tareas.length - 1].id;
                }
                console.log(this.tareas, this.tareaId)
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
                if (this.tareas.length === 0) {
                    this.tareaId = response.data.data.id;
                }
                console.log(response.data.data)
                console.log(this.tareaId)
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