<template>
    <v-container>
        <v-row>
            <v-spacer />
            <v-btn color="green" to="/proyectos/create">Crear proyecto</v-btn>
        </v-row>
        <br>
        <v-card>
            <v-data-table :items="proyectos" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-btn v-if="rol() == 1" v-text="'Editar'" color="blue" text small :to="`/proyectos/${item.id}`"/>
                    <DeleteDialog v-if="rol() == 1" :description="`¿Está seguro de querer eliminar el proyecto '${item.nombre}'? Esta acción no se puede deshacer.`" 
                        :itemUrl="`/proyectos/${item.id}`" :index="index"/>
                    <v-btn v-if="rol() == 1" v-text="'Progreso'" color="green" text small :to="`/proyectos/doc`"/>
                    <v-btn v-if="rol() == 1" v-text="'Constancia'" color="green" text small :to="`/proyectos/cons`"/>
                    <v-btn v-if="rol() == 3" v-text="'Seleccionar proyecto'" color="green" text small :to="`/proyectos/cons`"/>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import axios from 'axios';

export default {
    name: 'Proyectos',
    middleware: 'auth',

    data: () => ({
        proyectos: [],
        headers: [
            { text: 'ID', value: 'id' },
            { text: 'Nombre', value: 'nombre' },
            { text: 'Carrera', value: 'carrera.nombre' },
            { text: 'Encargado', value: 'encargado_codigo' },
            { text: 'Objetivos', value: 'objetivos' },
            { text: 'Fecha de inicio', value: 'fechainicio' },
            { text: 'Fecha final', value: 'fechafinal' },
            { text: 'Status', value: 'status' },
            { text: 'Alumnos', value: 'encargado_codigo' },
            { text: 'Acciones', value: 'actions' }
        ]
    }),

    async beforeMount() {
        this.$nuxt.$on('remove-from-list', this.deleteElement)
        this.$store.commit('setTitle', 'Proyectos')
        try {
            const response = await this.$axios.get('/proyectos')
            this.proyectos = response.data.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
        
    },

    methods: {
        rol (){
            return JSON.parse(localStorage.getItem('rol')).rol_id
        },
        deleteElement(index: number) {
            this.proyectos.pop(index)
        }
    }
}

</script>