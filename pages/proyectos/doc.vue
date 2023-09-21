<template>
    <v-container>
        <v-container v-if="rol.rol === 'alumno'" justify-center align-center>
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
                <v-btn rounded dark @click="cancelar()" color="red">
                    <v-icon>
                        mdi-arrow-left
                    </v-icon>
                    Proyectos
                </v-btn>
            </v-row>
            <br>
            <v-card outlined color="transparent">
                <v-card-title class="justify-center">
                    <b>Datos del proyecto: {{proyecto.nombre}}</b>
                </v-card-title>
                <v-row class="justify-center">
                    <v-col cols="12" sm="4">
                        <v-card 
                            style="margin-top: 0px; border-color: green; border-width: 1px; border-style: solid; 
                            width: 335px; padding: 20px; border-radius: 2%;">
                            <div align="center">
                                <h3 align="center">Formato Exel</h3>
                                <v-btn @click="createExel" text small color="green">
                                    <v-icon dark small>
                                        mdi-file-excel-box
                                    </v-icon>
                                    Descargar
                                </v-btn>
                            </div>
                        </v-card>
                        <br>
                        <v-card
                            style="margin-top: 0px; border-color: red; border-width: 1px; border-style: solid; 
                            width: 335px; padding: 20px; border-radius: 2%;">
                            <div align="center">
                                <h3 align="center">Formato PDF</h3>
                                <v-btn @click="createPDF" text small color="red">
                                    <v-icon dark small>
                                        mdi-file-document-outline
                                    </v-icon>
                                    Descargar
                                </v-btn>
                            </div>
                        </v-card>
                        <br>
                        <v-card
                            style="margin-top: 0px; border-color: blue; border-width: 1px; border-style: solid; 
                            width: 335px; padding: 20px; border-radius: 2%;">
                            <div align="center">
                                <h3 align="center">Descargar Exel y PDF</h3>
                                <v-btn @click="descarExPDF" text small color="blue">
                                    <v-icon dark small>
                                        mdi-file-document-outline
                                    </v-icon>
                                    Descargar
                                    <v-icon dark small>
                                        mdi-file-excel-box
                                    </v-icon>
                                </v-btn>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card>
        </v-container>
    </v-container>
</template>

<script lang="ts">

// @ts-nocheck

import XLSX from 'xlsx/dist/xlsx.full.min';
import {jsPDF} from 'jspdf';
import { encabezado, piepagina } from '@/plugins/imagesbase64';
import { clave } from '@/plugins/globals';
const CryptoJS = require("crypto-js");

export default {
    data: () => ({
        rol: {},
        proyecto: {},
        tareas: [],
        headers: [
            { text: 'Nombre', value: 'nombre' },
            { text: 'Estado actual del proyecto', value: 'statuses[0].Estado' },
            { text: 'Encargado', value: 'encargado.nombre' },
            { text: 'Objetivos del proyecto', value: 'objetivos' },
        ],
        alumPart: [],
        id: "",
    }),

    async beforeMount() {
        const response = await this.$axios.get('/login')
        this.rol = response.data
        const idCifrado = localStorage.getItem("proId")
        const bytes = CryptoJS.AES.decrypt(idCifrado, clave);
        const idDescifrado = bytes.toString(CryptoJS.enc.Utf8);
        this.id = idDescifrado
        
        try {
            const responseP = await this.$axios.get(`/proyectos/${this.id}`)
            this.proyecto = responseP.data.data
            const resTar = await this.$axios.get(`/tareas/proyecto/${this.id}`)
            this.tareas = resTar.data.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        async createPDF() {
            const response = await this.$axios.get(`/proyectos/${this.id}`);
            const pro = response.data.data;
            // eslint-disable-next-line new-cap
            const doc = new jsPDF();
            const img = new Image()
            const img2 = new Image()
            const hoy = new Date();
            const año = hoy.getFullYear();
            const mes = new Intl.DateTimeFormat('es-ES', { month: 'long'}).format(new Date())
            const dia = String(hoy.getDate()).padStart(2, '0');
            img.src = encabezado
            img2.src = piepagina
            doc.addImage(img, 'PNG', 10, 5, 115, 30)
            doc.setFontSize(14)
            doc.setFont("Courier", "bold")
            doc.text(`A QUIEN CORRESPONDA:`, 25, 45)
            const width = doc.internal.pageSize.getWidth()
            doc.setFontSize(13)
            doc.setFont("Courier", "normal")
            const line1 = `<font face="Courier" size=1 > <p style="width: 335px" align="justify"> El que suscribe <b>Dr. Héctor Huerta Avila</b>, Jefe de Departamento de Ciencias Computacionales e Ingenierías, del Centro Universitario de los Valles, por medio del presente certifica y hace </p> <br>
            <font size=2 > <p style="width: 335px" align="center"> <b>CONSTAR</b> </p> </font><br>
            <p style="width: 335px" align="justify"> Que el maestro encargado <b>${pro.encargado.nombre}</b> con código <b>${this.rol.codigo}</b> del proyecto denominado <b>${pro.nombre}</b>, presentó los avances del proyecto de acuerdo con el resolutivo séptimo del dictamen de creación del Programa Educativo mencionado. </p></font>`
            const container = document.createElement('div');
            container.innerHTML = line1;
            doc.html(container, {
                x: 25,
                y: 55,
                html2canvas: {
                    scale: 0.48,
                    Width: 160,
                },
                callback: function (doc) {
                    doc.save(`Progreso - Proyecto ${pro.nombre}.pdf`);
                },
            })
            doc.text(`Se extiende la presente a petición del interesado, para los fines legales a que ella convenga.`, 25, 140, {maxWidth: 160, align: "justify"})
            doc.setFontSize(12)
            doc.setFont("Courier", "bold")
            doc.text(`ATENTAMENTE`, width/2, 160, {align: "center"})
            doc.setFont("Courier", "normal")
            doc.text(`“Piensa y Trabaja”`, width/2, 164, {align: "center"})
            doc.setFontSize(13)
            doc.setFont("Courier", "bold")
            doc.text(`“2023, Año del fomento a la formación integral con una`, width/2, 168, {align: "center"})
            doc.text(`Red de Centros y Sistemas Multitemáticos”`, width/2, 172, {align: "center"})
            doc.setFontSize(12)
            doc.setFont("Courier", "normal")
            doc.text(`Ameca, Jalisco, ${dia} de ${mes} del ${año}`, width/2, 176, {align: "center"})
            doc.setFontSize(13)
            doc.setFont("Courier", "bold")
            doc.text(`Dr. ${pro.encargado.nombre}`, width/2, 186, {align: "center"})
            doc.setFont("Courier", "normal")
            doc.text(`Encargado del Proyecto`, width/2, 190, {align: "center"})
            doc.addImage(img2, 'PNG', 50, 270, 110, 16, {align: "center"});
        },

        createExel(){
            const pro = this.proyecto
            const datEx = [
                { Nombre: pro.nombre, Objetivo: pro.objetivos, Estado: pro.statuses[pro.statuses.length -1].Estado,
                Encargado: pro.encargado.nombre, Carrera: pro.Carrera.nombre, Cupos: pro.alumnos }
            ]

            const datEst = pro.statuses.map(function (item) {
                const tabla = { Estado: item.Estado, Nota: item.statusProyecto.nota, FechaCreación: item.statusProyecto.createdAt, FechaModificación: item.statusProyecto.updatedAt, FechaEliminación: item.statusProyecto.deletedAt } 
                return tabla 
            })

            const datAlum = pro.Alumnos.map(function (item) {
                const tabla = { Codigo: item.codigo, Nombre: item.nombre, Correo: item.email } 
                return tabla 
            })

            const datTar = this.tareas.map(function (item) {
                var estado = "Oculta"
                var entregada = "No"
                if(item.activo === 1){
                    estado = "Activo"
                }
                if(item.entregada === 1){
                    entregada = "Si"
                }
                const tabla = { Nombre: item.nombre, Descripcion: item.descripcion, Comentarios: item.comentarios, FecheEntrega: item.fecha_limite, HoraEntrega: item.hora_limite, Estado: estado, TareaEntregada: entregada, AlumnoEntregante: item.entregante } 
                return tabla 
            })

            const data = XLSX.utils.json_to_sheet(datEx)
            const data2 = XLSX.utils.json_to_sheet(datAlum)
            const data3 = XLSX.utils.json_to_sheet(datEst)
            const data4 = XLSX.utils.json_to_sheet(datTar)
            const workbook = XLSX.utils.book_new()
            const sheet1 = 'Datos del proyecto'
            const sheet2 = 'Datos de Participantes'
            const sheet3 = 'Hisorial de estados'
            const sheet4 = 'Hisorial de Tareas'
            const filename = pro.nombre
            XLSX.utils.book_append_sheet(workbook, data, sheet1)
            XLSX.utils.book_append_sheet(workbook, data2, sheet2)
            XLSX.utils.book_append_sheet(workbook, data3, sheet3)
            XLSX.utils.book_append_sheet(workbook, data4, sheet4)
            XLSX.writeFile(workbook, `Progreso - Proyecto ${filename}.xlsx`)
        },

        descarExPDF(){
            this.createPDF()
            this.createExel()
        },

        cancelar() {
            this.$router.push('/proyectos')
        }
    },
}

</script>