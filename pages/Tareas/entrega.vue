<template>
    <v-container>
        <v-form class="custom-v-form" style="border-radius: 2%;">
            <v-container v-if="entregada === 1">
                <v-card>
                    <v-card-title class="text-center">
                        <b>Ya entregaste esta tarea.</b>
                    </v-card-title>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn @click="cancelar()" rounded color="primary">
                            <v-icon>
                                mdi-keyboard-backspace
                            </v-icon>
                            Atrás
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-container>
            <v-container v-else-if="entrega < fecha">
                <v-card>
                    <v-card-text>
                        <v-card-title>
                            <b>Nombre de la tarea:</b> {{ tar.nombre }}
                        </v-card-title>
                        <v-card-text style="font-size: large ;border-width: 1px; border-style: solid; border-color: gray;">
                            <p></p>
                            <b style="font-size: medium;">Descripción de la tarea:</b>
                            <p>{{ tar.descripcion }}</p>
                        </v-card-text>
                        <br>
                        <v-card-text v-if="tar.comentarios !== ''"
                            style="font-size: large ;border-width: 1px; border-style: solid; border-color: gray;">
                            <p></p>
                            <b style="font-size: large;">Comentarios del profesor:</b>
                            <p>{{ tar.comentarios }}</p>
                        </v-card-text>
                        <br>
                        <v-row justify="center">
                            <v-text v-if="!Material" style="font-size: large;">No hay material de apoyo para esta
                                tarea</v-text>
                            <v-btn rounded color="primary" v-if="Material" @click="descargarArchivo">Descargar material de
                                apoyo</v-btn>
                        </v-row>
                        <br>
                        <v-alert ref="file" v-show="data.file" color="error" icon="$error">
                            El archivo no debe superar los 10mb.
                        </v-alert>
                        <v-card outlined
                            style="margin-top: 0px; padding: 20px; background-color: whitesmoke; box-shadow: 0 0 2px black;">
                            <v-text style="font-size: larger;">Subir tarea</v-text>
                            <br>
                            <v-text style="font-size: small; font-style: oblique;">No mayor a 10mb</v-text>
                            <v-file-input v-model="archivo" label="Seleccionar archivo"
                                :rules="[$validations.isFileLessThan10MB]"></v-file-input>
                        </v-card>
                        <br>
                        <v-row justify="center">
                            <v-btn @click="validarTamañoArchivo()" rounded class="white--text" color="#43B63B">
                                <v-icon>
                                    mdi-file
                                </v-icon>
                                Enviar archivo</v-btn>
                        </v-row>
                        <br>
                    </v-card-text>
                </v-card>
            </v-container>

            <v-container v-else>
                <v-card>
                    <v-card-title class="text-center" style="font-size: larger;">
                        <b>Ya no puedes hacer entregas de esta tarea.</b>
                    </v-card-title>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn @click="cancelar()" rounded color="#FF0000" class="white--text">
                            <v-icon>
                                mdi-keyboard-backspace
                            </v-icon>
                            Atrás
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-container>
        </v-form>
        <br>
        <v-row v-if="entrega < fecha && entregada !== 1" justify="center">
            <v-btn @click="cancelar()" rounded color="#FF0000" class="white--text">
                <v-icon>
                    mdi-cancel
                </v-icon>
                Cancelar
            </v-btn>
        </v-row>
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
        data: {
            file: false
        },
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

    watch: {
        archivo: {
            deep: true,
            handler() {
                this.data.file = false
            }
        },
    },

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
        scrollHaciaAlerta(elemento) {
            if (elemento && elemento.$el) {
                const offset = elemento.$el.offsetTop;
                window.scrollTo({
                    top: offset,
                    behavior: "smooth", // Esto hace que el desplazamiento sea suave
                });
            }
        },

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
                this.data.file = true
                this.$nextTick(() => {
                    this.scrollHaciaAlerta(this.$refs.file);
                });
                // eslint-disable-next-line no-useless-return
                return
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

<style>
.custom-v-form {
    margin-top: 0px;
    padding: 20px;
    background-color: #ace7ff;
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