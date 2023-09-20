<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/v-slot-style -->
<template>
    <v-container>
        <v-container v-if="rol !== 'administrador'" justify-center align-center>
            <v-card>
                <v-card-title>Acceso Denegado</v-card-title>
                <v-card-text>
                    <p>No tienes el rol necesario para acceder a esta página.</p>
                </v-card-text>
            </v-card>
        </v-container>
        <v-container v-else>
            <v-card-title>
                Lista de todas las carreras
            </v-card-title>
            <v-row>
                <v-spacer />
                <v-btn dark rounded color="#43B63B" to="/Carreras/Create">
                    <v-icon dark>
                        mdi-plus
                    </v-icon>
                    Registrar una nueva carrera
                </v-btn>
            </v-row>
            <br>
            <v-card-title>
                Carreras
            </v-card-title>
            <v-card outlined class="custom-v-card" style="background-color: #c7eeff;">
                <v-data-table :items="carreras" :headers="headers" class="custom-data-table-carreras" :header-props="headerProps"
                :footer-props="{itemsPerPageText: 'Carreras por página', pageText: '{0} - {1} de {2}'}">
                    <template v-slot:item.actions="{ item, index }">
                        <v-btn v-text="'Editar'" color="blue" text small :to="`/Carreras/${item.clave}`" />
                        <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}'?`"
                            :itemUrl="`/Carreras/${item.clave}`" :index="index" list="" @remove-from-list="deleteElement" />
                    </template>
                </v-data-table>
            </v-card>
            <br>
        </v-container>
    </v-container>
</template>
// @ts-nocheck
<script lang="ts">
// @ts-nocheck
import Vue from "vue"
export default Vue.extend({

    name: 'Carreras',
    middleware: 'auth',

    data() {
        return {
            rol: "",
            carreras: [],
            headerProps: {
                sortByText: "Ordenar por"
            },
            headers: [
                { text: 'Nombre', value: 'nombre' },
                { text: 'Clave', value: 'clave' },
                { text: 'Acciones', value: 'actions' },
            ],
        }
    },


    async beforeMount() {
        this.$nuxt.$on('remove-from-list', this.deleteElement)
        this.$store.commit('setTitle', 'Carreras')
        const responseR = await this.$axios.get('/login')
        this.rol = responseR.data.rol
        try {
            const response = await this.$axios.get('/Carreras')
            this.carreras = response.data.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error)
        }
    },

    methods: {
        deleteElement(index: number) {
            this.carreras.splice(index, 1);
            location.reload()
        }
    }
})

</script>

<style>

.custom-v-card {
    margin-top: 0px;
    padding: 20px;
    box-shadow: 0 0 20px black;
}

.custom-data-table-carreras {
    border-style: solid;
    border-width: 2px;
    border-color: #64B5F6;
}

/* Estiliza los encabezados de la tabla */
.custom-data-table-carreras .v-data-table-header th {
    background-color: #64B5F6;
    /* Color de fondo más oscuro para los encabezados */
    color: white;
    /* Color del texto en los encabezados */
}

/* Estiliza las filas alternas */
.custom-data-table-carreras tbody tr:nth-of-type(odd) {
    background-color: #fff;
    /* Fondo gris claro para filas impares */
}

.custom-data-table-carreras tbody tr:nth-of-type(even) {
    background-color: #c7eeff;
    /* Fondo blanco para filas pares */
}

.custom-data-table-carreras .v-data-footer {
    background-color: #e1e2e3;
}


.custom-data-table-carreras .v-data-table-header {
    color: white;
}
</style>
