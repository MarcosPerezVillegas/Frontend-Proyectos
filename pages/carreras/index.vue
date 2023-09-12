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
                <v-btn color="green" to="/Carreras/Create">Registrar una nueva carrera</v-btn>
            </v-row>
            <br>
            <v-card-title>
                Carreras
            </v-card-title>
            <v-card outlined>
                <v-data-table :items="carreras" :headers="headers">
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
  