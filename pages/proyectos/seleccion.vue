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
                    <b>{{proyecto.nombre}}</b>
                </font>
                </v-card-title>
                <v-card-text v-if="estado === 'Activo' || !log">
                <font size=3>
                    <b>Objetivos:</b>  {{proyecto.objetivos}}
                    <v-spacer />
                    <b>Carrera:</b> {{carrera}} 
                    <v-spacer />
                    <b>Encargado:</b> {{maestro}} </h3>
                    <v-spacer />
                    <b>Fecha de inicio:</b> {{proyecto.fechainicio}} </h3>
                    <v-spacer />
                    <b>Fecha de termino:</b> {{proyecto.fechafinal}} </h3>
                    <v-spacer />
                    <b>Cupos restantes:</b> {{proyecto.alumnos}} </h3>
                </font>
                </v-card-text>
                <v-card-text v-if="estado === 'Terminado'">
                <font size=3>
                    <b>Objetivos:</b> {{proyecto.objetivos}} 
                    <v-spacer />
                    <b>Carrera:</b> {{carrera}} 
                    <v-spacer />
                    <b>Encargado:</b> {{maestro}}
                    <v-spacer />
                    <b>Fecha de inicio:</b> {{proyecto.fechainicio}}
                    <v-spacer />
                    <b>Fecha de termino:</b> {{proyecto.fechafinal}}
                    <v-spacer />
                    <b>Estado:</b> {{estado}}
                </font>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn style="color: white" rounded @click="cancelar()" color="red">
                        <v-icon small>
                            mdi-cancel
                        </v-icon>
                        Cancelar
                    </v-btn>
                    <ConfirmDialog v-if="roles.rol === 'alumno' && proyecto.alumnos !== 0 && estado === 'Activo' && log" 
                        :description="`¿Está seguro de querer unirce al proyecto '${proyecto.nombre}'? Esta acción no se puede deshacer.`"
                        :itemUrl="`/alumnos/${roles.codigo}`" :index="proyecto.id" :item="`${proyecto.id}`"/>
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
            const response = await this.$axios.get(`/Proyectos/${this.id}`)
            this.proyecto = response.data.data
            this.proyecto.fechainicio= new Date(this.proyecto.fechainicio).toISOString().split('T')[0]
            this.proyecto.fechafinal= new Date(this.proyecto.fechafinal).toISOString().split('T')[0]
            this.carrera = this.proyecto.Carrera.nombre
            this.maestro = this.proyecto.encargado.nombre
            this.estado = this.proyecto.statuses[this.proyecto.statuses.length-1].Estado
        } catch (error) {
            this.log= false
            const response = await this.$axios.get(`/Proyectos/${this.id}`)
            this.proyecto = response.data.data
            this.carrera = this.proyecto.Carrera.nombre
            this.maestro = this.proyecto.encargado.nombre
            this.$nuxt.setLayout('inicio');
        }
        this.load = false
    },

    methods: {
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
</style>