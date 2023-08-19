<!-- eslint-disable vue/no-parsing-error -->
<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/v-slot-style -->
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
                    <v-menu offset-y v-if="roles.rol == 'administrador'">
                        <template v-slot:activator="{ on }">
                            <v-btn color="blue" v-on="on" text small> Opciones </v-btn>
                        </template>
                        <v-list>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn v-text="'Editar'" color="blue" text small :to="`/proyectos/${item.id}`"/>
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <DeleteDialog :description="`¿Está seguro de querer eliminar el proyecto '${item.nombre}'? Esta acción no se puede deshacer.`" 
                                        :itemUrl="`/proyectos/${item.id}`" :index="index"/>
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn v-text="'Progreso'" color="green" text small @click="genProg(item.id)"/>
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn v-text="'Constancia'" color="green" text small @click="contPro(item.id)"/>
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn @click="selecPro(item.id)" v-text="'ver proyecto'" color="green" text small />
                                </v-list-item-action>
                            </v-list-item>
                        </v-list>  
                    </v-menu>
                    <v-btn v-if="roles.rol == 'alumno'" @click="selecID(item.id)" v-text="'ver proyecto'" color="green" text small />
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
                    <v-menu offset-y v-if="roles.rol == 'administrador'">
                        <template v-slot:activator="{ on }">
                            <v-btn color="blue" v-on="on" text small> Opciones </v-btn>
                        </template>
                        <v-list>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn v-text="'Editar'" color="blue" text small :to="`/proyectos/${item.id}`"/>
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <DeleteDialog :description="`¿Está seguro de querer eliminar el proyecto '${item.nombre}'? Esta acción no se puede deshacer.`" 
                                        :itemUrl="`/proyectos/${item.id}`" :index="index"/>
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn v-text="'Progreso'" color="green" text small @click="genProg(item.id)"/>
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn v-text="'Constancia'" color="green" text small @click="contPro(item.id)"/>
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn @click="selecPro(item.id)" v-text="'ver proyecto'" color="green" text small />
                                </v-list-item-action>
                            </v-list-item>
                        </v-list>  
                    </v-menu>
                    <v-btn v-if="roles.rol == 'maestro'" v-text="'Progreso'" color="green" text small @click="genProg(item.id)"/>
                    <v-btn v-if="roles.rol == 'maestro'" @click="selecPro(item.id)" v-text="'ver proyecto'" color="green" text small />
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

// @ts-nocheck

import {jsPDF} from 'jspdf';
const CryptoJS = require("crypto-js");

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
            const idPro = index.toString()
            const clave = "Anitalabalatina"
            const idCifrado = CryptoJS.AES.encrypt(idPro, clave).toString();
            localStorage.setItem('proId',idCifrado)
            this.$router.push('/proyectos/seleccion')
        },
        selecPro (index: number){
            const idPro = index.toString()
            const clave = "Anitalabalatina"
            const idCifrado = CryptoJS.AES.encrypt(idPro, clave).toString();
            localStorage.setItem('proId',idCifrado)
            this.$router.push('/proyectos/datos')
        },
        async contPro (index: number){
            const response = await this.$axios.get(`/proyectos/${index}`)
            const pro = response.data.data
            // eslint-disable-next-line new-cap
            const doc = new jsPDF();
            doc.text(`El certificado en cuestion es otorgado por el proyecto ${pro.nombre} realizado
            bajo la supervicion de ${pro.encargado.nombre}, de la carrera de ${pro.Carrera.nombre}`, 10, 10)
            doc.save('Certificado.pdf')
        },
        genProg (index: number){
            const idPro = index.toString()
            const clave = "Anitalabalatina"
            const idCifrado = CryptoJS.AES.encrypt(idPro, clave).toString();
            localStorage.setItem('proId',idCifrado)
            this.$router.push('/proyectos/doc')
        },
        deleteElement(index: number) {
            this.proyectos.pop(index)
            location.reload();
        }
    }
}

</script>