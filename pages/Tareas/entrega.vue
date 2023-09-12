<template>
    <v-container>
        <v-form>
            <v-card v-if="entregada === 1">
                <v-card-actions>
                    <p>Ya Entregaste esta tarea</p>
                    <v-spacer />
                    <v-btn @click="cancelar()" color="blue">
                        Cancelar
                    </v-btn>
                </v-card-actions>
            </v-card>
            <v-card v-else-if="entrega < fecha">
                <v-card-title>
                    Nombre de la tarea: {{ tar.nombre }}
                </v-card-title>
                <v-card-text style="font-size: large;">
                    Descripción de la tarea: {{ tar.descripcion }}
                </v-card-text>
                <v-card-text v-if="tar.comentarios !== ''" style="font-size: large;">
                    Comentarios del profesor: {{ tar.comentarios }}
                </v-card-text>
                <v-btn v-if="Material" @click="descargarArchivo">Descargar material de apoyo</v-btn>
                <v-card-text>
                    <v-text style="font-size: larger;">Subir tarea</v-text>
                    <br>
                    <v-text style="font-size: small; font-style: oblique;">No mayor a 10mb</v-text>
                    <v-file-input v-model="archivo" label="Seleccionar archivo"></v-file-input>
                </v-card-text>
                <v-btn @click="validarTamañoArchivo()" color="primary">Enviar archivo</v-btn>
                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="cancelar()" color="red">
                        Cancelar
                    </v-btn>
                </v-card-actions>
            </v-card>
            <v-card v-else>
                <v-card-actions>
                    <p>Ya no puedes hacer entregas de esta tarea</p>
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

// @ts-nocheck
import { clave } from '@/plugins/globals';
const CryptoJS = require("crypto-js");

export default {
    name: 'TareaEntrega',
    middleware: 'auth',
    data: () => ({
        roles: {},
        archivo: null,
        id: "",
        alumno: "",
        fecha: "",
        entrega: "",
        tarea: {
            entregada: Number,
            entregante: ""
        },
        tar: {
        },
        Material: false,
        entregada: Number,
        res: null
    }),

    async beforeMount() {
        const idCifrado = localStorage.getItem("Tarea")
        const bytes = CryptoJS.AES.decrypt(idCifrado, clave);
        const idDescifrado = bytes.toString(CryptoJS.enc.Utf8);
        this.id = idDescifrado
        window.addEventListener('popstate', this.PopState);
        try {
            const responseR = await this.$axios.get('/login')
            this.roles = responseR.data
            const res = await this.$axios.get(`/Alumnos/${this.roles.codigo}`)
            this.alumno = res.data.data.nombre
            const hoy = new Date();
            const año = hoy.getFullYear();
            const mes = String(hoy.getMonth() + 1).padStart(2, '0');
            const dia = String(hoy.getDate()).padStart(2, '0');

            const horas = String(hoy.getHours()).padStart(2, '0');
            const minutos = String(hoy.getMinutes()).padStart(2, '0');
            const segundos = String(hoy.getSeconds()).padStart(2, '0');

            const fecha = `${año}-${mes}-${dia}`;
            const hora = `${horas}:${minutos}:${segundos}`;
            const date = `${fecha} ${hora}`
            const restar = await this.$axios.get(`/Tareas/${this.id}`)
            this.tar = restar.data.data
            this.entregada = restar.data.data.entregada
            const fechalimite = `${restar.data.data.fecha_limite} ${restar.data.data.hora_limite}`;
            this.fecha = new Date(fechalimite)
            this.entrega = new Date(date)
            try {
                this.res = await this.$axios.get(`/Tarea/Cargar/Material/${this.id}/${this.tar.Proyecto_id}`, {
                    responseType: 'arraybuffer',
                })
                this.Material = true
            } catch { }

        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },


    methods: {
        validarTamañoArchivo() {
            // Verificar si se ha seleccionado un archivo
            if (!this.archivo) {
                this.$nuxt.$emit('show-snackbar', 'red', 'Por favor, selecciona un archivo antes de enviarlo.');
                return;
            }

            // Establecer el tamaño máximo permitido (en bytes)
            const tamañoMaximo = 10 * 1024 * 1024; // 10 MB (ajusta según tus necesidades)

            // Verificar el tamaño del archivo seleccionado
            if (this.archivo.size > tamañoMaximo) {
                this.$nuxt.$emit('show-snackbar', 'red', 'El archivo seleccionado es demasiado grande. Por favor, elige un archivo más pequeño.');
                this.archivo = null; // Limpia el archivo seleccionado
            } else {

                this.enviarArchivo()
            }

        },
        async enviarArchivo() {
            const formData = new FormData()
            formData.append('archivo', this.archivo)
            try {
                const restar = await this.$axios.get(`/Tareas/${this.id}`)
                const response = await this.$axios.post(`Tarea/Entrega/${this.id}/${restar.data.data.Proyecto_id}`, formData)
                this.tarea.entregada = 1
                this.tarea.entregante = this.alumno
                await this.$axios.put(`/Tareas/${this.id}`, this.tarea)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }

            this.$router.push('/Tareas')
        },

        descargarArchivo() {
            const contentType = this.res.headers['content-type']
            const ext = contentType.split('/')[1];
            const blob = new Blob([this.res.data], { type: contentType })
            const url = URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.target = '_blank'
            link.download = `${this.tar.nombre}-Material de apoyo.${ext}`
            link.click()
            URL.revokeObjectURL(url)
        },

        cancelar() {
            window.history.back();
        }
    }
}

</script>