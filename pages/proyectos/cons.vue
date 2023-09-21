<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/v-slot-style -->
<template>
    <v-container>
        <v-container v-if="rol === 'alumno'" justify-center align-center>
            <v-form class="custom-v-form">
                <v-card>
                    <v-card-title class="headline"><b>Acceso denegado</b></v-card-title>
                    <v-card-text>
                        <b>No tienes el rol necesario para acceder a esta página.</b>
                    </v-card-text>
                </v-card>
            </v-form>
        </v-container>
        <v-container v-else>
            <v-row>
                <v-spacer />
                <v-btn dark @click="cancelar()" color="red" small>
                    <v-icon>
                        mdi-arrow-left
                    </v-icon>
                    Proyectos
                </v-btn>
            </v-row>
            <br>
            <v-card-title>
                <b>Alumnos participantes</b>
            </v-card-title>
            <v-card outlined>

                <v-data-table :items="aluPart" class="rows-green" :headers="headers" :header-props="headerProps"
                    :footer-props="{ itemsPerPageText: 'Alumnos por página', pageText: '{0} - {1} de {2}' }">
                    <template v-slot:item.actions="{ item, index }">
                        <v-btn color="green" text small @click="contPro(item.codigo)">
                            <v-icon dark small>
                                mdi-file
                            </v-icon>
                            Constancia
                        </v-btn>
                    </template>
                </v-data-table>
            </v-card>
        </v-container>
    </v-container>
</template>

<script lang="ts">

// @ts-nocheck
import { jsPDF } from 'jspdf';
import { clave } from '@/plugins/globals';
import { encabezado, piepagina } from '@/plugins/imagesbase64';
const CryptoJS = require("crypto-js");

export default {
    data: () => ({
        rol: "",
        proyecto: {},
        id: "",
        carrera: "",
        aluPart: [],
        headerProps: {
            sortByText: "Ordenar por"
        },
        headers: [
            { text: 'Codigo', value: 'codigo' },
            { text: 'Nombre', value: 'nombre' },
            { text: 'Acciones', value: 'actions' }
        ]
    }),
    async beforeMount() {
        const idCifrado = localStorage.getItem("proId");
        const bytes = CryptoJS.AES.decrypt(idCifrado, clave);
        const idDescifrado = bytes.toString(CryptoJS.enc.Utf8);
        this.id = idDescifrado;
        try {
            const responseR = await this.$axios.get('/login')
            this.rol = responseR.data.rol
            if (this.rol === 'alumno') { return }
            const responseP = await this.$axios.get(`/proyectos/${this.id}`)
            this.proyecto = responseP.data.data
            this.aluPart = this.proyecto.Alumnos
            this.carrera = this.proyecto.Carrera.nombre
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        async contPro(index: String) {
            const pro = this.proyecto
            // eslint-disable-next-line new-cap
            const doc = new jsPDF();
            const img = new Image()
            const img2 = new Image()
            const hoy = new Date();
            const año = hoy.getFullYear();
            const mes = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date())
            const dia = String(hoy.getDate()).padStart(2, '0');
            img.src = encabezado
            img2.src = piepagina
            const res2 = await this.$axios.get(`/alumnos/${index}`);
            const nombre = res2.data.data.nombre;
            doc.addImage(img, 'PNG', 10, 5, 115, 30)
            doc.setFontSize(14)
            doc.setFont("Courier", "bold")
            doc.text(`A QUIEN CORRESPONDA:`, 25, 45)
            const width = doc.internal.pageSize.getWidth()
            doc.setFontSize(13)
            doc.setFont("Courier", "normal")
            const line1 = `<font face="Courier" size=1 > <p style="width: 335px" align="justify"> El que suscribe <b>Dr. Héctor Huerta Avila</b>, Jefe de Departamento de Ciencias Computacionales e Ingenierías, del Centro Universitario de los Valles, por medio del presente certifica y hace </p> <br>
            <font size=2 > <p style="width: 335px" align="center"> <b>CONSTAR</b> </p> </font><br>
            <p style="width: 335px" align="justify"> Que el alumno de la carrera de ${this.carrera}, <b>${nombre}</b> con código <b>${index}</b> presentó el proyecto denominado <b>${pro.nombre}</b>, de acuerdo con el resolutivo séptimo del dictamen de creación del Programa Educativo mencionado. </p></font>`
            const container = document.createElement('div');
            container.innerHTML = line1;
            doc.html(container, {
                x: 25,
                y: 50,
                html2canvas: {
                    scale: 0.48,
                    Width: 160,
                },
                callback: function (doc) {
                    doc.save(`Certificado - ${nombre}.pdf`);
                },
            })
            doc.text(`Se extiende la presente a petición del interesado, para los fines legales a que ella convenga.`, 25, 140, { maxWidth: 160, align: "justify" })
            doc.setFontSize(12)
            doc.setFont("Courier", "bold")
            doc.text(`ATENTAMENTE`, width / 2, 160, { align: "center" })
            doc.setFont("Courier", "normal")
            doc.text(`“Piensa y Trabaja”`, width / 2, 164, { align: "center" })
            doc.setFontSize(13)
            doc.setFont("Courier", "bold")
            doc.text(`“${año}, Año del fomento a la formación integral con una`, width / 2, 168, { align: "center" })
            doc.text(`Red de Centros y Sistemas Multitemáticos”`, width / 2, 172, { align: "center" })
            doc.setFontSize(12)
            doc.setFont("Courier", "normal")
            doc.text(`Ameca, Jalisco, ${dia} de ${mes} del ${año}`, width / 2, 176, { align: "center" })
            doc.setFontSize(13)
            doc.setFont("Courier", "bold")
            doc.text(`Dr. Héctor Huerta Avila`, width / 2, 186, { align: "center" })
            doc.setFont("Courier", "normal")
            doc.text(`Jefe de Departamento`, width / 2, 190, { align: "center" })
            doc.addImage(img2, 'PNG', 50, 270, 110, 16, { align: "center" });
        },

        cancelar() {
            this.$router.push('/proyectos')
        }
    },
};

</script>

<style>
.custom-v-form {
    margin-top: 0px;
    padding: 20px;
    background-color: #66BB6A;
    box-shadow: 0 0 20px black;
}

.rows-green .v-data-table-header {
    background-color: #66BB6A;
}

.rows-green {
    border-style: solid;
    border-width: 2px;
    border-color: #66BB6A;
}
</style>

