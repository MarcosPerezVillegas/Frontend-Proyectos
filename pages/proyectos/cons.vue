<template>
    <v-container>
        <v-row>
            <v-spacer />
            <v-btn @click="renderDoc">Render docx</v-btn>
            <v-btn v-if="roles.rol == 'maestro' || roles.rol == 'administrador'" @click="cancelar()" color="red">Cancelar</v-btn>
        </v-row>
        <br>
        <v-card>
            <v-data-table :items="documento" :headers="headers">
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script lang="ts">

import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";

function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
}

export default {
    data: () => ({
        roles: {},
        documento: [],
        headers: [
            { text: 'ID', value: 'id' },
            { text: 'Nombre', value: 'nombre' },
            { text: 'Descripcion', value: 'descripcion' },
            { text: 'Archivo', value: 'tipo_archivo' },
        ]
    }),
    async beforeMount() {
        try {
            const responseR = await this.$axios.get('/login')
            this.roles = responseR.data
            const response = await this.$axios.get(`/documentos`)
            this.documento = response.data.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        renderDoc() {
            const docs = this.documento
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

                    //doc.setData(docid)
                    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                    doc.render({
                        first_name: docs[0].nombre,
                        last_name: docs[0].tipo_archivo,
                        phone: docs[0].id,
                        description: docs[0].descripcion,
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