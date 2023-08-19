<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/v-slot-style -->
<template>
    <v-container>
        <v-card-title>
            Lista de todos los usuarios
        </v-card-title>
        <v-row>
            <v-spacer />
            <v-btn color="green" to="/Carreras/Create">Registrar una nueva carrera</v-btn>
        </v-row>
        <br>
        <v-card-title>
            Administradores
        </v-card-title>
        <v-card>
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
</template>
// @ts-nocheck
<script lang="ts">
// @ts-nocheck
import Vue from "vue"
import DeleteDialog from "@/components/DeleteDialog.vue"
export default Vue.extend ({

    name: 'Carreras',
    middleware: 'auth',

    data(){
        return{
            components:{
            DeleteDialog
        },
        carreras: [],
        headers: [
            { text: 'Nombre', value: 'nombre' },
            { text: 'Clave', value: 'clave' },
            { text: 'Acciones', value: 'actions' },
        ],
        }
    },


    async beforeMount() {
        this.$store.commit('setTitle', 'Carreras')
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
  