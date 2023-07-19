<template>
    <v-container>
        <v-row>
            <v-spacer />
            <v-btn v-if="roles.rol == 'maestro' || roles.rol == 'administrador'" color="green" to="/proyectos/create">Crear proyecto</v-btn>
        </v-row>
        <br>
        <v-card v-if="roles.rol == 'alumno' || roles.rol == 'administrador' ">
            <v-card-title>
                Todos los Proyectos
            </v-card-title >
            <v-data-table :items="proyectos" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-btn v-if="roles.rol == 'administrador'" v-text="'Editar'" color="blue" text small :to="`/proyectos/${item.id}`"/>
                    <DeleteDialog v-if="roles.rol == 'administrador'" :description="`¿Está seguro de querer eliminar el proyecto '${item.nombre}'? Esta acción no se puede deshacer.`" 
                        :itemUrl="`/proyectos/${item.id}`" :index="index"/>
                    <v-btn v-if="roles.rol == 'administrador' " v-text="'Progreso'" color="green" text small @click="genProg(item.id)"/>
                    <v-btn v-if="roles.rol == 'administrador'" v-text="'Constancia'" color="green" text small @click="contPro(item.id)"/>
                    <v-btn @click="selecID(item.id)" v-text="'ver proyecto'" color="green" text small />
                </template>
            </v-data-table>
        </v-card>
        <br>
        <v-card v-if="roles.rol == 'maestro' &&  proMaes.length > 0 || roles.rol == 'administrador' &&  proMaes.length > 0">
            <v-card-title>
                Mis Proyectos
            </v-card-title>
            <v-data-table :items="proMaes" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-btn v-if="roles.rol == 'administrador'" v-text="'Editar'" color="blue" text small :to="`/proyectos/${item.id}`"/>
                    <DeleteDialog v-if="roles.rol == 'administrador'" :description="`¿Está seguro de querer eliminar el proyecto '${item.nombre}'? Esta acción no se puede deshacer.`" 
                        :itemUrl="`/proyectos/${item.id}`" :index="index"/>
                    <v-btn v-if="roles.rol == 'maestro' || roles.rol == 'administrador' " v-text="'Progreso'" color="green" text small @click="genProg(item.id)"/>
                    <v-btn v-if="roles.rol == 'administrador'" v-text="'Constancia'" color="green" text small @click="contPro(item.id)"/>
                    <v-btn @click="selecPro(item.id)" v-text="'ver proyecto'" color="green" text small />
                </template>
            </v-data-table>
        </v-card>
        <v-card v-if="roles.rol == 'maestro' && proMaes.length == 0 || roles.rol == 'administrador' && proMaes.length == 0">
            <v-card-title>
                No tienes ningun proyecto
            </v-card-title>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import XLSX from 'xlsx/dist/xlsx.full.min';
import {jsPDF} from 'jspdf';

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
            if(this.roles.rol === 'maestro' || this.roles.rol === 'administrador'){
                const resmaest = await this.$axios.get(`/proyectos/usuario/${this.roles.codigo}`)
                this.proMaes = resmaest.data.data
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
        async contPro (index: number){
            const response = await this.$axios.get(`/proyectos/${index}`)
            const pro = response.data.data
            const doc = new jsPDF();
            doc.text(`El certificado en cuestion es otorgado por el proyecto ${pro.nombre} realizado
            bajo la supervicion de ${pro.encargado.nombre}, de la carrera de ${pro.Carrera.nombre}`, 10, 10)
            doc.save('Certificado.pdf')
        },
        genProg (index: number){
            localStorage.setItem('proId',index)
            this.$router.push('/proyectos/doc')
        },
        deleteElement(index: number) {
            this.proyectos.pop(index)
            location.reload();
        }
    }
}

</script>