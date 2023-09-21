<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/no-parsing-error -->
<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/v-slot-style -->
<template>
    <v-container>
        <v-row>
            <v-spacer />
            <v-btn style="color: white" v-if="roles.rol == 'maestro' || roles.rol == 'administrador'" 
                rounded color="green" to="/proyectos/create">
                <v-icon dark>
                    mdi-plus
                </v-icon>
                Crear proyecto
            </v-btn>
        </v-row>
        <br>
        <v-card-title class="headline" v-if="roles.rol == 'alumno' || roles.rol == 'administrador'">
            <b>Todos los Proyectos</b>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                label="Buscar proyecto"
                single-line
                hide-details
            ></v-text-field>
        </v-card-title>
        <v-card outlined v-if="roles.rol == 'alumno' || roles.rol == 'administrador'">
            <v-data-table :items="proyectos" :headers="headers" class="rows-green" :search="search" :header-props="headerProps"
                :footer-props="{itemsPerPageText: 'Proyectos por página', pageText: '{0} - {1} de {2}'}">
                <template v-slot:item.statuses="item, index">
                    <span>
                        <v-chip :color="getColor(item.item.statuses[item.item.statuses.length - 1].Estado)" style="color: white">
                            {{ item.item.statuses[item.item.statuses.length - 1].Estado }}
                        </v-chip>
                    </span>
                </template>
                <template v-slot:item.actions="{ item, index }">
                    <v-menu offset-y v-if="roles.rol == 'administrador'">
                        <template v-slot:activator="{ on }">
                            <v-btn style="color: #66BB6A" text v-on="on" small> 
                                <v-icon>
                                    mdi-format-list-bulleted-square
                                </v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn text small color="blue" text small :to="`/proyectos/${item.id}`">
                                        <v-icon small>
                                            mdi-border-color
                                        </v-icon>
                                        Editar
                                    </v-btn>
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
                                    <v-btn text small color="green" text small @click="genProg(item.id)">
                                        <v-icon small>
                                            mdi-chart-box-outline
                                        </v-icon>
                                        Progreso
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item v-if="item.statuses[item.statuses.length - 1].Estado === 'Terminado'">
                                <v-list-item-action>
                                    <v-btn text small color="green" text small @click="contPro(item.id)">
                                        <v-icon small>
                                            mdi-file-document-outline
                                        </v-icon>
                                        Constancia
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn @click="selecPro(item.id)" color="green" text small>
                                        <v-icon small>
                                            mdi-book
                                        </v-icon>
                                        Ver proyecto
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                    <v-btn v-if="roles.rol == 'alumno'" @click="selecID(item.id)"" color="green" text small>
                        <v-icon small>
                            mdi-book
                        </v-icon>
                        Ver proyecto
                    </v-btn>
                </template>
                <template v-slot:no-results>
                    <v-alert :value="true" color="error">
                        No se encontraron resultados de "{{ search }}".
                    </v-alert>
                </template>
            </v-data-table>
        </v-card>
        <br>
        <v-card-title class="headline" v-if="roles.rol == 'maestro' && proMaes.length > 0 || roles.rol == 'administrador' && proMaes.length > 0">
            <b>Mis Proyectos</b>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search2"
                label="Buscar proyecto"
                single-line
                hide-details
            ></v-text-field>
        </v-card-title>
        <v-card outlined v-if="roles.rol == 'maestro' && proMaes.length > 0 || roles.rol == 'administrador' && proMaes.length > 0">
            <v-data-table :items="proMaes" :headers="headers" class="rows-green" :search="search2" :header-props="headerProps"
                :footer-props="{itemsPerPageText: 'Proyectos por página', pageText: '{0} - {1} de {2}'}">
                <template v-slot:item.statuses="item, index">
                    <span>
                        <v-chip :color="getColor(item.item.statuses[item.item.statuses.length - 1].Estado)" style="color: white">
                            {{ item.item.statuses[item.item.statuses.length - 1].Estado }}
                        </v-chip>
                    </span>
                </template>
                <template v-slot:item.actions="{ item, index }">
                    <v-menu offset-y v-if="roles.rol == 'administrador'">
                        <template v-slot:activator="{ on }">
                            <v-btn style="color: #66BB6A" text v-on="on" small> 
                                <v-icon>
                                    mdi-format-list-bulleted-square
                                </v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn text small color="blue" text small :to="`/proyectos/${item.id}`">
                                        <v-icon small>
                                            mdi-border-color
                                        </v-icon>
                                        Editar
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-action>
                                    <DeleteDialog
                                        :description="`¿Está seguro de querer eliminar el proyecto '${item.nombre}'? Esta acción no se puede deshacer.`"
                                        :itemUrl="`/proyectos/${item.id}`" :index="index" />
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item v-if="item.statuses[item.statuses.length - 1].Estado !== 'En espera'">
                                <v-list-item-action>
                                    <v-btn text small color="green" text small @click="genProg(item.id)">
                                        <v-icon small>
                                            mdi-chart-box-outline
                                        </v-icon>
                                        Progreso
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item v-if="item.statuses[item.statuses.length - 1].Estado === 'Terminado'">
                                <v-list-item-action>
                                    <v-btn text small color="green" text small @click="contPro(item.id)">
                                        <v-icon small>
                                            mdi-file-document-outline
                                        </v-icon>
                                        Constancia
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>
                            <v-list-item v-if="item.statuses.some(estado => estado.Estado !== 'En espera')">
                                <v-list-item-action>
                                    <v-btn @click="selecPro(item.id)" color="green" text small>
                                        <v-icon small>
                                            mdi-book
                                        </v-icon>
                                        Ver proyecto
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                    <v-btn v-if="roles.rol == 'maestro' && item.statuses[item.statuses.length - 1].Estado === 'En espera'"
                        text small color="blue" :to="`/proyectos/${item.id}`">
                        <v-icon small>
                            mdi-border-color
                        </v-icon>
                        Editar
                    </v-btn>
                    <v-btn v-if="roles.rol == 'maestro' && item.statuses.some(estado => estado.Estado !== 'En espera')"
                        text small color="green" @click="genProg(item.id)">
                        <v-icon small>
                            mdi-chart-box-outline
                        </v-icon>
                        Progreso
                    </v-btn>
                    <v-btn v-if="roles.rol == 'maestro' && item.statuses.some(estado => estado.Estado !== 'En espera')"
                        @click="selecPro(item.id)" color="green" text small>
                        <v-icon small>
                            mdi-book
                        </v-icon>
                        Ver proyecto
                    </v-btn>
                    <span v-else-if="roles.rol == 'maestro'">
                        El proyecto está en proceso de validación
                    </span>
                    <span v-else-if="!item.statuses.some(estado => estado.Estado !== 'En espera')">
                        El proyecto está en proceso de validación
                    </span>
                </template>
                <template v-slot:no-results>
                    <v-alert :value="true" color="error">
                        No se encontraron resultados de "{{ search2 }}".
                    </v-alert>
                </template>
            </v-data-table>
        </v-card>
        <br>
        <v-card-title class="headline" v-if="roles.rol == 'administrador'">
            <b>Proyectos sin Validar</b>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search3"
                label="Buscar proyecto"
                single-line
                hide-details
            ></v-text-field>
        </v-card-title>
        <v-card outlined v-if="roles.rol == 'administrador'">
            <v-data-table :items="proyectosV" :headers="headers" class="rows-orange" :search="search3" :header-props="headerProps"
                :footer-props="{itemsPerPageText: 'Proyectos por página', pageText: '{0} - {1} de {2}'}">
                <template v-slot:item.statuses="item, index">
                    <span>
                        <v-chip :color="getColor(item.item.statuses[item.item.statuses.length - 1].Estado)" style="color: white">
                            {{ item.item.statuses[item.item.statuses.length - 1].Estado }}
                        </v-chip>
                    </span>
                </template>
                <template v-slot:item.actions="{ item, index }">
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn style="color: #FFA726" text v-on="on" small> 
                                <v-icon>
                                    mdi-format-list-bulleted-square
                                </v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item>
                                <v-list-item-action>
                                    <v-btn text small color="blue" text small :to="`/proyectos/${item.id}`">
                                        <v-icon small>
                                            mdi-border-color
                                        </v-icon>
                                        Editar
                                    </v-btn>
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
                                    <v-btn @click="selecPro(item.id)" color="green" text small >
                                        <v-icon small>
                                            mdi-book
                                        </v-icon>
                                        Ver proyecto
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </template>
                <template v-slot:no-results>
                    <v-alert :value="true" color="error">
                        No se encontraron resultados de "{{ search3 }}".
                    </v-alert>
                </template>
            </v-data-table>
        </v-card>
        <br>
        <v-card outlined v-if="roles.rol == 'maestro' && proMaes.length == 0 || roles.rol == 'administrador' && proMaes.length == 0">
            <v-card-title>
                <b>No tienes ningun proyecto</b>
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
        search: '',
        search2: '',
        search3: '',
        proMaes: [],
        proyectos: [],
        proyectosV: [],
        numEstat: "",
        headerProps: {
            sortByText: "Ordenar por"
        },
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
        getColor (estado) {
            if (estado === 'Activo') return 'green'
            else if (estado === 'Terminado') return 'red'
            else return 'orange'
        },
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

<style>

.rows-green .v-data-table-header {
    background-color: #66BB6A;
}

.rows-green {
    border-style: solid;
    border-width: 2px;
    border-color: #66BB6A;
}

.rows-orange .v-data-table-header {
    background-color: #FFA726;
}

.rows-orange {
    border-style: solid;
    border-width: 2px;
    border-color: #FFA726;
}

</style>