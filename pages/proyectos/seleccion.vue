<template>
    <v-container v-if="load">
        <v-form class="custom-v-form">
            <v-card>
                <v-card-title class="headline"><b>Cargando...</b></v-card-title>
                <v-card-text>
                    <b>Por favor espere...</b>
                </v-card-text>
            </v-card>
        </v-form>
    </v-container>
    <v-container v-else>
        <v-form @submit.prevent="guardar" class="custom-v-form">
            <v-card>
                <v-card-title class="justify-center">
                    <font size=5>
                        <b>{{ proyecto.nombre }}</b>
                    </font>
                </v-card-title>
                <v-card-text style="font-size: large;">
                    <font size=5>
                        <b>Objetivos:</b>
                    </font>
                    <p></p>
                    <div>
                        <v-textarea class="text-justify-center"
                            style=" font-size: 120%; content: unset; transform: translateY(-10px);"
                            v-model="proyecto.objetivos" outlined readonly auto-grow></v-textarea>
                    </div>
                    <v-div v-if="prop === true">
                        <v-row justify="center">
                            <v-col cols="12" sm="4">
                                <v-btn rounded color="primary" @click="descargarArchivo">Descargar la propuesta del
                                    proyecto</v-btn>
                            </v-col>
                            <br><br><br><br>
                        </v-row>
                    </v-div>
                    <font size=5>
                        <b>Carrera:</b>
                    </font>
                    {{ carrera }}
                    <br>
                    <v-spacer />
                    <font size=5>
                        <b>Encargado:</b>
                    </font>
                    {{ maestro }}
                    <br>
                    <v-spacer />
                    <font size=5>
                        <b>Fecha de inicio:</b>
                    </font>
                    {{ proyecto.fechainicio }}
                    <br>
                    <v-spacer />
                    <font size=5>
                        <b>Fecha de termino:</b>
                    </font>
                    {{ proyecto.fechafinal }}
                    <br>
                    <font size=5>
                        <b>Cupos restantes:</b>
                    </font>
                    {{ proyecto.alumnos }}
                    <br>

                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn style="color: white" rounded @click="cancelar()" color="red">
                        <v-icon small>
                            mdi-cancel
                        </v-icon>
                        Cancelar
                    </v-btn>
                    <ConfirmDialog
                        v-if="roles.rol === 'alumno' && proyecto.alumnos !== '0' && estado === 'Activo' && log && alumo === null"
                        :description="`¿Está seguro de querer unirce al proyecto '${proyecto.nombre}'? Esta acción no se puede deshacer.`"
                        :itemUrl="`/alumnos/${roles.codigo}`" :index="proyecto.id" :item="`${proyecto.id}`" />
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
</template>

<script lang="ts">

// @ts-nocheck
import { clave } from '@/plugins/globals';
const CryptoJS = require("crypto-js");
import ConfirmDialog from "@/components/ConfirmDialog.vue";

export default {
    name: 'ProyectosSelect',
    data: () => ({
        load: true,
        roles: {},
        proyecto: {},
        log: false,
        maestro: "",
        carrera: "",
        id: "",
        estado: "",
        alumo: null,
        res: null,
        prop: true,
    }),

    async beforeMount() {
        this.$store.commit('setTitle', 'Proyectos')
        const idCifrado = localStorage.getItem("proId")
        const bytes = CryptoJS.AES.decrypt(idCifrado, clave);
        const idDescifrado = bytes.toString(CryptoJS.enc.Utf8);
        this.id = idDescifrado

        try {
            const responseR = await this.$axios.get('/login')
            this.roles = responseR.data
            this.log = true
            if (this.roles.rol === 'alumno') {
                const responseA = await this.$axios.get(`/Alumnos/${this.roles.codigo}`)
                this.alumo = responseA.data.data.proyecto_id
            }
            const response = await this.$axios.get(`/Proyectos/${this.id}`)
            this.proyecto = response.data.data
            this.proyecto.fechainicio = new Date(this.proyecto.fechainicio).toISOString().split('T')[0]
            this.proyecto.fechafinal = new Date(this.proyecto.fechafinal).toISOString().split('T')[0]
            this.carrera = this.proyecto.Carrera.nombre
            this.maestro = this.proyecto.encargado.nombre
            this.estado = this.proyecto.statuses[this.proyecto.statuses.length - 1].Estado
        } catch (error) {
            this.log = false
            const response = await this.$axios.get(`/Proyectos/${this.id}`)
            this.proyecto = response.data.data
            this.carrera = this.proyecto.Carrera.nombre
            this.maestro = this.proyecto.encargado.nombre
            this.$nuxt.setLayout('inicio');
        }
        try {
            this.res = await this.$axios.get(`/Proyectos/Cargar/${this.id}`, {
                responseType: 'arraybuffer',
            })
        } catch (error) {
            this.prop = false
        }
        this.load = false
    },

    methods: {
        descargarArchivo() {
            const contentType = this.res.headers['content-type']
            const ext = contentType.split('/')[1];
            const blob = new Blob([this.res.data], { type: contentType })
            const url = URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.target = '_blank'
            link.download = `${this.proyecto.id}-${this.proyecto.nombre}-Propuesta.${ext}`
            link.click()
            URL.revokeObjectURL(url)
        },
        cancelar() {
            window.history.back()
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
    border-radius: 10px;
}

.text-justify-center textarea {
    text-align: center;
    /* Centrar el texto */
}
</style>