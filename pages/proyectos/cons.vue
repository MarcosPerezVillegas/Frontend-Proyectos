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
                <v-btn @click="createDoc">Render docx</v-btn>
                <v-btn v-if="roles.rol == 'maestro' || roles.rol == 'administrador'" @click="cancelar()"
                    color="red">Cancelar</v-btn>
            </v-row>
            <br>
            <v-card>
                <v-data-table :items="documento" :headers="headers">
                </v-data-table>
            </v-card>
        </v-container>
    </v-container>
</template>

<script lang="ts">

// @ts-nocheck

import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import jsPDF from 'jspdf';

function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
}

export default {
    data: () => ({
        rol: "",
        documento: [],
        proyecto: {},
        headers: [
            { text: 'ID', value: 'id' },
            { text: 'Nombre', value: 'nombre' },
            { text: 'Descripcion', value: 'descripcion' },
            { text: 'Archivo', value: 'tipo_archivo' },
        ]
    }),
    async beforeMount() {
        const id = localStorage.getItem('proId')
        try {
            const responseR = await this.$axios.get('/login')
            this.rol = responseR.data.rol
            const response = await this.$axios.get(`/documentos`)
            this.documento = response.data.data
            const responseP = await this.$axios.get(`/proyectos/${id}`)
            this.proyecto = responseP.data.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        createDoc() {
            const pro = this.proyecto
            // eslint-disable-next-line new-cap
            const doc = new jsPDF();
            doc.text(`El certificado en cuestion es otorgado por el proyecto ${pro.nombre} realizado
            bajo la supervicion de ${pro.encargado.nombre}, de la carrera de ${pro.Carrera.nombre}`, 10, 10)
            doc.save('Certificado.pdf')
        },

        renderDoc() {
            const pro = this.proyecto
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const docs = document.getElementById("doc");
            loadFile(
                "https://docxtemplater.com/tag-example.docx",
                function (error, content) {
                    if (error) {
                        throw error;
                    }
                    const zip = new PizZip(content);
                    const doc = new Docxtemplater(zip, {
                        paragraphLoop: true,
                        linebreaks: true,
                    });

                    // doc.setData(docid)
                    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                    doc.render({
                        first_name: pro.nombre,
                        last_name: pro.objetivos,
                        phone: pro.alumnos,
                        description: pro.Carrera.nombre,
                    });

                    const blob = doc.getZip().generate({
                        type: "blob",
                        mimeType:
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    });
                    // Output the document using Data-URI
                    saveAs(blob, "output.docx");
                }
            );
        },

        cancelar() {
            this.$router.push('/proyectos')
        }
    },
};

</script>