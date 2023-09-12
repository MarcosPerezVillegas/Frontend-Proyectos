<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/no-parsing-error -->
<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/v-slot-style -->
<template>
    <v-container>
        <v-row>
            <v-spacer />
            <v-btn v-if="roles.rol == 'maestro' || roles.rol == 'administrador'" color="green" to="/proyectos/create">Crear
                proyecto</v-btn>
        </v-row>
        <br>
        <v-card outlined v-if="roles.rol == 'alumno' || roles.rol == 'administrador'">
            <v-card-title>
                Todos los Proyectos
            </v-card-title>
            <v-data-table  :items="proyectos" :headers="headers">
                <template v-slot:item.statuses="item, index">
                    <span>
                        {{ item.item.statuses[item.item.statuses.length - 1].Estado }}
                    </span>
                </template>
                <template v-slot:item.actions="{ item, index }">
                    <v-menu offset-y v-if="roles.rol == 'administrador'">
                        <template v-slot:activator="{ on }">
                            <v-btn color="blue" v-on="on" text small> Opciones </v-btn>
                        </template>
                        <v-list>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn v-text="'Editar'" color="blue" text small :to="`/proyectos/${item.id}`" />
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <DeleteDialog
                                        :description="`¿Está seguro de querer eliminar el proyecto '${item.nombre}'? Esta acción no se puede deshacer.`"
                                        :itemUrl="`/proyectos/${item.id}`" :index="index" />
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn v-text="'Progreso'" color="green" text small @click="genProg(item.id)" />
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn v-text="'Constancia'" color="green" text small @click="contPro(item.id)" />
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn @click="selecPro(item.id)" v-text="'ver proyecto'" color="green" text small />
                                </v-list-item-action>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                    <v-btn v-if="roles.rol == 'alumno'" @click="selecID(item.id)" v-text="'ver proyecto'" color="green" text
                        small />
                </template>
            </v-data-table>
        </v-card>
        <br>
        <v-card outlined v-if="roles.rol == 'maestro' && proMaes.length > 0 || roles.rol == 'administrador' && proMaes.length > 0">
            <v-card-title>
                Mis Proyectos
            </v-card-title>
            <v-data-table :items="proMaes" :headers="headers">
                <template v-slot:item.statuses="item, index">
                    <span>
                        {{ item.item.statuses[item.item.statuses.length - 1].Estado }}
                    </span>
                </template>
                <template v-slot:item.actions="{ item, index }">
                    <v-menu offset-y v-if="roles.rol == 'administrador'">
                        <template v-slot:activator="{ on }">
                            <v-btn color="blue" v-on="on" text small> Opciones </v-btn>
                        </template>
                        <v-list>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn v-text="'Editar'" color="blue" text small :to="`/proyectos/${item.id}`" />
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <DeleteDialog
                                        :description="`¿Está seguro de querer eliminar el proyecto '${item.nombre}'? Esta acción no se puede deshacer.`"
                                        :itemUrl="`/proyectos/${item.id}`" :index="index" />
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item v-if="item.statuses.some(estado => estado.Estado !== 'En espera')">
                                <v-list-item-action>
                                    <v-btn v-text="'Progreso'" color="green" text small @click="genProg(item.id)" />
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item v-if="item.statuses.some(estado => estado.Estado !== 'En espera')">
                                <v-list-item-action>
                                    <v-btn v-text="'Constancia'" color="green" text small @click="contPro(item.id)" />
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item >
                                <v-list-item-action>
                                    <v-btn @click="selecPro(item.id)" v-text="'ver proyecto'" color="green" text small />
                                </v-list-item-action>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                    <v-btn v-if="roles.rol == 'maestro' && item.statuses.some(estado => estado.Estado !== 'En espera')"
                        v-text="'Progreso'" color="green" text small @click="genProg(item.id)" />
                    <v-btn v-if="roles.rol == 'maestro' && item.statuses.some(estado => estado.Estado !== 'En espera')"
                        @click="selecPro(item.id)" v-text="'ver proyecto'" color="green" text small />
                    <span v-else-if="roles.rol == 'maestro'">
                        El proyecto está en proceso de validación
                    </span>
                    <span v-else-if="!item.statuses.some(estado => estado.Estado !== 'En espera')">
                        El proyecto está en proceso de validación
                    </span>
                </template>
            </v-data-table>
        </v-card>
        <br>
        <v-card outlined v-if="roles.rol == 'administrador'">
            <v-card-title>
                Proyectos sin Validar
            </v-card-title>
            <v-data-table :items="proyectosV" :headers="headers">
                <template v-slot:item.statuses="item, index">
                    <span>
                        {{ item.item.statuses[item.item.statuses.length - 1].Estado }}
                    </span>
                </template>
                <template v-slot:item.actions="{ item, index }">
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn color="blue" v-on="on" text small> Opciones </v-btn>
                        </template>
                        <v-list>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn v-text="'Editar'" color="blue" text small :to="`/proyectos/${item.id}`" />
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <DeleteDialog
                                        :description="`¿Está seguro de querer eliminar el proyecto '${item.nombre}'? Esta acción no se puede deshacer.`"
                                        :itemUrl="`/proyectos/${item.id}`" :index="index" />
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn v-text="'Progreso'" color="green" text small @click="genProg(item.id)" />
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn v-text="'Constancia'" color="green" text small @click="contPro(item.id)" />
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn @click="selecPro(item.id)" v-text="'ver proyecto'" color="green" text small />
                                </v-list-item-action>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                    <v-btn v-if="roles.rol == 'maestro'" v-text="'Progreso'" color="green" text small
                        @click="genProg(item.id)" />
                    <v-btn v-if="roles.rol == 'maestro'" @click="selecPro(item.id)" v-text="'ver proyecto'" color="green"
                        text small />
                </template>
            </v-data-table>
        </v-card>
        <br>
        <v-card outlined v-if="roles.rol == 'maestro' && proMaes.length == 0 || roles.rol == 'administrador' && proMaes.length == 0">
            <v-card-title>
                No tienes ningun proyecto
            </v-card-title>
        </v-card>
    </v-container>
</template>

<script lang="ts">

// @ts-nocheck

import { clave } from '@/plugins/globals';
const CryptoJS = require("crypto-js");

export default {
    name: 'Proyectos',
    middleware: 'auth',

    data: () => ({
        roles: {},
        alum: {},
        proMaes: [],
        proyectos: [],
        proyectosV: [],
        numEstat: "",
        headers: [
            { text: 'Nombre', value: 'nombre' },
            { text: 'Estado actual del proyecto', value: 'statuses' },
            { text: 'Cupos restantes', value: 'alumnos' },
            { text: 'Objetivos del proyecto', value: 'objetivos' },
            { text: 'Acciones', value: 'actions' }
        ]
    }),

    async beforeMount() {
        this.$nuxt.$on('remove-from-list', this.deleteElement)
        this.$store.commit('setTitle', 'Proyectos')
        try {
            const response = await this.$axios.get('/proyectos')
            this.proyectosV = response.data.data.filter(proyecto => {
                // Obtiene el último estado del arreglo statuses
                const ultimoEstado = proyecto.statuses[proyecto.statuses.length - 1];

                // Verifica si el último estado es "En espera" y excluye el proyecto si es cierto
                return (ultimoEstado && ultimoEstado.Estado === "En espera");
            });
            this.proyectos = response.data.data.filter(proyecto => {
                // Verifica si al menos un estado tiene un valor diferente de "En espera"
                return proyecto.statuses.some(estado => estado.Estado !== "En espera");
            });
            const responseR = await this.$axios.get('/login')
            this.roles = responseR.data
            if (this.roles.rol === 'maestro' || this.roles.rol === 'administrador') {
                const resmaest = await this.$axios.get(`/proyectos/usuario/${this.roles.codigo}`)
                this.proMaes = resmaest.data.data
            }
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }

    },

    methods: {
        selecID(index: number) {
            const idPro = index.toString()
            const idCifrado = CryptoJS.AES.encrypt(idPro, clave).toString();
            localStorage.setItem('proId', idCifrado)
            this.$router.push('/proyectos/seleccion')
        },
        selecPro(index: number) {
            const idPro = index.toString()
            const idCifrado = CryptoJS.AES.encrypt(idPro, clave).toString();
            localStorage.setItem('proId', idCifrado)
            this.$router.push('/proyectos/datos')
        },
        contPro(index: number) {
            const idPro = index.toString()
            const idCifrado = CryptoJS.AES.encrypt(idPro, clave).toString();
            localStorage.setItem('proId', idCifrado)
            this.$router.push('/proyectos/cons')
        },
        genProg(index: number) {
            const idPro = index.toString()
            const idCifrado = CryptoJS.AES.encrypt(idPro, clave).toString();
            localStorage.setItem('proId', idCifrado)
            this.$router.push('/proyectos/doc')
        },
        deleteElement(index: number) {
            this.proyectos.pop(index)
            location.reload();
        }
    }
}

</script>