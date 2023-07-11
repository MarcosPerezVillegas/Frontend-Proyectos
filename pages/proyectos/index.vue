<template>
    <v-container>
        <v-row>
            <v-spacer />
            <v-btn v-if="roles.rol == 'maestro' || roles.rol == 'administrador'" color="green" to="/proyectos/create">Crear proyecto</v-btn>
        </v-row>
        <br>
        <v-card>
            <v-card-title>
                Todos los Proyectos
            </v-card-title>
            <v-data-table :items="proyectos" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-btn v-if="roles.rol == 'administrador'" v-text="'Editar'" color="blue" text small :to="`/proyectos/${item.id}`"/>
                    <DeleteDialog v-if="roles.rol == 'administrador'" :description="`¿Está seguro de querer eliminar el proyecto '${item.nombre}'? Esta acción no se puede deshacer.`" 
                        :itemUrl="`/proyectos/${item.id}`" :index="index"/>
                    <v-btn v-if="roles.rol == 'administrador' " v-text="'Progreso'" color="green" text small :to="`/proyectos/doc`"/>
                    <v-btn v-if="roles.rol == 'administrador'" v-text="'Constancia'" color="green" text small :to="`/proyectos/cons`"/>
                    <v-btn @click="selecID(item.id)" v-text="'ver proyecto'" color="green" text small />
                </template>
            </v-data-table>
        </v-card>
        <br>
        <v-card v-if="roles.rol == 'maestro' || roles.rol == 'administrador' ">
            <v-card-title>
                Mis Proyectos
            </v-card-title>
            <v-data-table :items="proMaes" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-btn v-if="roles.rol == 'administrador'" v-text="'Editar'" color="blue" text small :to="`/proyectos/${item.id}`"/>
                    <DeleteDialog v-if="roles.rol == 'administrador'" :description="`¿Está seguro de querer eliminar el proyecto '${item.nombre}'? Esta acción no se puede deshacer.`" 
                        :itemUrl="`/proyectos/${item.id}`" :index="index"/>
                    <v-btn v-if="roles.rol == 'maestro' || roles.rol == 'administrador' " v-text="'Progreso'" color="green" text small :to="`/proyectos/doc`"/>
                    <v-btn v-if="roles.rol == 'administrador'" v-text="'Constancia'" color="green" text small :to="`/proyectos/cons`"/>
                    <v-btn @click="selecPro(item.id)" v-text="'ver proyecto'" color="green" text small />
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
        proMaes: [],
        proyectos: [],
        headersMaes: [
            { text: 'Nombre', value: 'nombre' },
            { text: 'Status', value: 'statuses[0].Estado' },
            { text: 'Cupos', value: 'alumnos' },
            { text: 'Acciones', value: 'actions' }
        ],
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
            if(this.roles.rol === 'maestro'){
                const resmaest = await this.$axios.get(`/proyectos/usuario/${this.roles.codigo}`)
                this.proMaes = resmaest.data.data
                console.log(this.proMaes)
                console.log(resmaest.data)
            }
            
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
        
    },

    methods: {
        selecID (index: number){
            localStorage.setItem('proId',index)
            this.$router.push('/proyectos/seleccion')
        },
        selecPro (index: number){
            localStorage.setItem('proId',index)
            this.$router.push('/proyectos/datos')
        },
        deleteElement(index: number) {
            this.proyectos.pop(index)
        }
    }
}

</script>