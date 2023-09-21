<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
    <v-dialog v-model="confirmDialog" persistent>
        <template v-slot:activator="{ on, attrs }">
            <v-btn rounded class="white--text" color="#66BB6A" v-bind="attrs" v-on="on">
                <v-icon small>
                    mdi-plus
                </v-icon>
                Inscribirse
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                ¿Desea continuar?
            </v-card-title>
            <v-card-text>
                {{ description }}
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn v-text="'Cancelar'" text small @click="confirmDialog = false" />
                <v-btn v-text="'Confirmar'" color="green" text small @click="insc" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">

// @ts-nocheck

const CryptoJS = require("crypto-js");
import { clave } from '@/plugins/globals';

export default {
    name: "ConfirmDialog",

    props: {
        description: {
            type: String,
            required: true,
        },

        itemUrl: {
            type: String,
            required: true,
        },
        item: {
            type: String,
            required: true,
        },

        index: {
            type: Number,
            required: true,
        }
    },

    data: () => ({
        confirmDialog: false,
        roles: {},
        proyecto: {},
        alum: {
            codigo: "",
            email: "",
            nombre: "",
            proyecto_id: "",
            telefono: ""
        },
        id: "",
    }),

    methods: {
        async insc() {
            const idCifrado = localStorage.getItem("proId")
            const bytes = CryptoJS.AES.decrypt(idCifrado, clave);
            const idDescifrado = bytes.toString(CryptoJS.enc.Utf8);
            this.id = idDescifrado
            try {
                const response = await this.$axios.get(`/proyectos/${this.id}`)
                this.proyecto = response.data.data
                const resRol = await this.$axios.get('/Login')
                this.roles = resRol.data
                const rol = this.roles
                const pro = this.proyecto
                const responseA = await this.$axios.get(`/alumnos/${rol.codigo}`)
                this.alum = responseA.data.data
                this.alum.proyecto_id = this.id
                await this.$axios.put(`/alumnos/${rol.codigo}`, this.alum)
                this.proyecto.alumnos = pro.alumnos - 1
                await this.$axios.put(`/proyectos/${this.proyecto.id}`, this.proyecto)
                location.replace('/proyectos/datos');     
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        }
    }
}

</script>