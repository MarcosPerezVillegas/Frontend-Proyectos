<template>
    <v-container>
        <v-container v-if="rol !== 'maestro' || rol !== 'administrador'" justify-center align-center>
            <v-card>
                <v-card-title>Acceso Denegado</v-card-title>
                <v-card-text>
                    <p>No tienes el rol necesario para acceder a esta página.</p>
                </v-card-text>
            </v-card>
        </v-container>
        <v-container v-else>
        <v-row>
            <v-spacer />
            <v-btn @click="cancelar()" color="red">Cancelar</v-btn>
        </v-row>
        <br>
        <v-card>
            <v-card-title>
                    Datos del proyecto
            </v-card-title>
            <v-card-text>
                Formato Exel <v-btn @click="createExel" color="green">Descargar</v-btn>
                <br><br>
                Formato PDF <v-btn @click="createPDF" color="red">Descargar</v-btn>    
            </v-card-text>
        </v-card>
        </v-container>
    </v-container>
</template>

<script lang="ts">

// @ts-nocheck

import XLSX from 'xlsx/dist/xlsx.full.min';
import {jsPDF} from 'jspdf';
const CryptoJS = require("crypto-js");

export default {
    data: () => ({
        rol: "",
        proyecto: {},
        id: "",
    }),

    async beforeMount() {
        const response = await this.$axios.get('/login')
        this.rol = response.data.rol
        const clave = "Anitalabalatina"
        const idCifrado = localStorage.getItem("proId")
        const bytes = CryptoJS.AES.decrypt(idCifrado, clave);
        const idDescifrado = bytes.toString(CryptoJS.enc.Utf8);
        this.id = idDescifrado
        
        try {
            const responseP = await this.$axios.get(`/proyectos/${this.id}`)
            this.proyecto = responseP.data.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        createPDF(){
            const pro = this.proyecto
            // eslint-disable-next-line new-cap
            const doc = new jsPDF();
            doc.text(`
            Nombre: ${pro.nombre}
            Objetivo: ${pro.objetivos}
            Status: ${pro.statuses[0].Estado}
            Encargado: ${pro.encargado.nombre}
            Carrera: ${pro.Carrera.nombre}`, 10, 10)
            doc.save('Progreso.pdf')
        },

        createExel(){
            const pro = this.proyecto
            const datEx = [
                { Nombre: pro.nombre, Objetivo: pro.objetivos, Status: pro.statuses[0].Estado,
                Encargado: pro.encargado.nombre, Carrera: pro.Carrera.nombre, Cupos: pro.alumnos }
            ]
            const data = XLSX.utils.json_to_sheet(datEx)
            const workbook = XLSX.utils.book_new()
            const filename = 'Progreso'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },

        cancelar() {
            this.$router.push('/proyectos')
        }
    },
}

</script>