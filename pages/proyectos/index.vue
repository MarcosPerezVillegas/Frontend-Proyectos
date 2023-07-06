<template>
    <v-container>
        <v-row>
            <v-spacer />
            <v-btn v-if="roles.rol == 'maestro' || roles.rol == 'administrador'" color="green" to="/proyectos/create">Crear proyecto</v-btn>
        </v-row>
        <br>
        <v-card>
            <v-data-table :items="proyectos" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-btn v-if="roles.rol == 'administrador'" v-text="'Editar'" color="blue" text small :to="`/proyectos/${item.id}`"/>
                    <DeleteDialog v-if="roles.rol == 'administrador'" :description="`¿Está seguro de querer eliminar el proyecto '${item.nombre}'? Esta acción no se puede deshacer.`" 
                        :itemUrl="`/proyectos/${item.id}`" :index="index"/>
                    <v-btn v-if="roles.rol == 'maestro'" v-text="'Progreso'" color="green" text small :to="`/proyectos/doc`"/>
                    <v-btn v-if="roles.rol == 'administrador'" v-text="'Constancia'" color="green" text small :to="`/proyectos/cons`"/>
                    <v-btn v-if="item.alumnos != 0" @click="selecID(item.id)" v-text="'ver proyecto'" color="green" text small />
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
        roles: {},
        alum: {},
        proyectos: [],
        headers: [
            { text: 'Nombre', value: 'nombre' },
            { text: 'Status', value: 'statuses[0].Estado' },
            { text: 'Cupos', value: 'alumnos' },
            { text: 'Acciones', value: 'actions' }
        ]
    }),

    async beforeMount() {
        this.$nuxt.$on('remove-from-list', this.deleteElement)
        this.$store.commit('setTitle', 'Proyectos')
        try {
            const response = await this.$axios.get('/proyectos')
            this.proyectos = response.data.data
            const responseR = await this.$axios.get('/login')
            this.roles = responseR.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
        
    },

    methods: {
        async selecID (index: number){
            localStorage.setItem('proId',index)
            this.$router.push('/proyectos/seleccion')
        },
        deleteElement(index: number) {
            this.proyectos.pop(index)
        }
    }
}

</script>