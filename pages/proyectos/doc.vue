<template>
    <v-container>
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
</template>

<script lang="ts">
import XLSX from 'xlsx/dist/xlsx.full.min';
import {jsPDF} from 'jspdf';

export default {
    data: () => ({
        proyecto: {},
    }),

    async beforeMount() {
        const id = localStorage.getItem('proId')
        
        try {
            const responseP = await this.$axios.get(`/proyectos/${id}`)
            this.proyecto = responseP.data.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        createPDF(){
            const pro = this.proyecto
            const doc = new jsPDF();
            doc.text(`
            Nombre: ${pro.nombre}
            Objetivo: ${pro.objetivos}
            Status: ${pro.statuses[0].Estado}
            Encargado: ${pro.encargado.nombre}
            Carrera: ${pro.Carrera.nombre}`, 10, 10)
            doc.save('Certificado.pdf')
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