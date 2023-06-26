<template>
    <v-container>
        <v-row>
            <v-spacer />
            <v-btn v-if="rol() == 'maestro'" color="green" to="/proyectos/create">Crear proyecto</v-btn>
        </v-row>
        <br>
        <v-card>
            <v-data-table :items="proyectos" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-btn v-if="rol() == 'maestro'" v-text="'Editar'" color="blue" text small :to="`/proyectos/${item.id}`"/>
                    <DeleteDialog v-if="rol() == 'maestro'" :description="`¿Está seguro de querer eliminar el proyecto '${item.nombre}'? Esta acción no se puede deshacer.`" 
                        :itemUrl="`/proyectos/${item.id}`" :index="index"/>
                    <v-btn v-if="rol() == 'maestro'" v-text="'Progreso'" color="green" text small :to="`/proyectos/doc`"/>
                    <v-btn v-if="rol() == 'maestro'" v-text="'Constancia'" color="green" text small :to="`/proyectos/cons`"/>
                    <v-btn v-if="rol() == 'alumno'" @click="selecID(item.id)" v-text="'Seleccionar proyecto'" color="green" text small />
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
            { text: 'Objetivos', value: 'objetivos' },
            { text: 'Fecha de inicio', value: 'fechainicio' },
            { text: 'Fecha final', value: 'fechafinal' },
            { text: 'Acciones', value: 'actions' }
        ]
    }),

    async beforeMount() {
        this.$nuxt.$on('remove-from-list', this.deleteElement)
        this.$store.commit('setTitle', 'Proyectos')
        try {
            console.log(localStorage.getItem('rol'))
            const response = await this.$axios.get('/proyectos')
            this.proyectos = response.data.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
        
    },

    methods: {
        rol (){
            return localStorage.getItem('rol')
        },
        selecID (index: number){
            localStorage.setItem('proId',index)
            this.$router.push('/proyectos/seleccion')
        },
        deleteElement(index: number) {
            this.proyectos.pop(index)
        }
    }
}

</script>