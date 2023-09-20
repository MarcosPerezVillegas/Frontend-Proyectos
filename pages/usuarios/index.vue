<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/v-slot-style -->
<template>
    <v-container>
        <v-container v-if="rol === 'alumno' || rol === 'maestro'" justify-center align-center>
            <v-card style="margin-top: 0px; padding: 20px; background-color: #c7eeff; box-shadow: 0 0 20px black;">
                <v-card-title><b>Acceso denegado</b></v-card-title>
                <v-card-text>
                    <b>No tienes el rol necesario para acceder a esta página.</b>
                </v-card-text>
            </v-card>
        </v-container>
        <v-container v-else>
            <v-card-title class="headline">
                <b>Listas de todos los usuarios</b>
            </v-card-title>
            <v-row>
                <v-spacer />
                <v-btn dark rounded color="orange" to="/Usuarios/Restore">
                    <v-icon dark>
                        mdi-restore
                    </v-icon>
                    Recuperar o decartar usuarios
                </v-btn>
            </v-row>
            <p></p>
            <v-row>
                <v-spacer />
                <v-btn dark rounded color="#43B63B" to="/Usuarios/Create">
                    <v-icon dark>
                        mdi-plus
                    </v-icon>
                    Registrar usuarios
                </v-btn>
            </v-row>
            <br>
            <v-card-title>
                Administradores
            </v-card-title>
            <v-card outlined class="custom-v-card" style="background-color: #c7eeff;">
                <v-data-table :items="administradores" :headers="headers" class="custom-data-table-usuario"
                    :header-props="headerProps"
                    :footer-props="{ itemsPerPageText: 'Administradores por página', pageText: '{0} - {1} de {2}' }">
                    <template v-slot:item.actions="{ item, index }">
                        <v-menu offset-y>
                            <template #activator="{ on }">
                                <v-btn v-text="'Acciones'" color="orange" text small v-on="on" />
                            </template>
                            <v-list>
                                <v-list-item>
                                    <v-btn v-text="'Editar usuario'" color="blue" text small
                                        @click="editItem(`/Maestros/${item.codigo}`, item, 'Administrador')" />
                                </v-list-item>
                                <v-list-item>
                                    <DeleteDialog
                                        :description="`¿Está seguro de querer eliminar el usuario '${item.nombre}'?`"
                                        :index="index" :item="item.codigo" :itemUrl="`/Maestros/${item.codigo}`"
                                        :list="'Administradores'" />
                                </v-list-item>
                            </v-list>
                        </v-menu>
                        <!--
                        <v-btn v-text="'Editar'" color="blue" text small :to="{ path: `/Usuarios/${item.codigo}`,
                    query: { url: `/Maestros/${item.codigo}`, rol_usuario: 'Administrador' } }" />
                    <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}'?`"
                        :itemUrl="`/Maestros/${item.codigo}`" :index="index" list="administradores" :item="item.codigo"/>
                    -->
                    </template>
                </v-data-table>
            </v-card>
            <br>
            <v-card-title>
                Maestros
            </v-card-title>
            <v-card outlined class="custom-v-card" style="background-color: #c7eeff;">
                <v-data-table :items="maestros" :headers="headers" class="custom-data-table-usuario"
                    :header-props="headerProps"
                    :footer-props="{ itemsPerPageText: 'Maestros por página', pageText: '{0} - {1} de {2}' }">
                    <template v-slot:item.actions="{ item, index }">
                        <v-menu offset-y>
                            <template #activator="{ on }">
                                <v-btn v-text="'Acciones'" color="orange" text small v-on="on" />
                            </template>
                            <v-list>
                                <v-list-item>
                                    <v-btn v-text="'Editar usuario'" color="blue" text small
                                        @click="editItem(`/Maestros/${item.codigo}`, item, 'Maestro')" />
                                </v-list-item>
                                <v-list-item>
                                    <DeleteDialog
                                        :description="`¿Está seguro de querer eliminar el usuario '${item.nombre}'?`"
                                        :index="index" :item="item.codigo" :itemUrl="`/Maestros/${item.codigo}`"
                                        :list="'Maestros'" />
                                </v-list-item>
                            </v-list>
                        </v-menu>
                        <!--
                        <v-btn v-text="'Editar'" color="blue" text small :to="{ path: `/Usuarios/${item.codigo}`,
                    query: { url: `/Maestros/${item.codigo}`, rol_usuario: 'Maestro'}}" />
                    <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}'?`"
                        :itemUrl="`/Maestros/${item.codigo}`" :index="index" list="maestros" :item="item.codigo"/>
                    -->
                    </template>
                </v-data-table>
            </v-card>
            <br>
            <v-card-title>
                Alumnos
            </v-card-title>
            <v-card outlined class="custom-v-card" style="background-color: #c7eeff;">
                <v-data-table :items="alumnos" :headers="headers" class="custom-data-table-usuario"
                    :header-props="headerProps"
                    :footer-props="{ itemsPerPageText: 'Alumnos por página', pageText: '{0} - {1} de {2}' }">
                    <template v-slot:item.actions="{ item, index }">
                        <v-menu offset-y>
                            <template #activator="{ on }">
                                <v-btn v-text="'Acciones'" color="orange" text small v-on="on" />
                            </template>
                            <v-list>
                                <v-list-item>
                                    <v-btn v-text="'Editar usuario'" color="blue" text small
                                        @click="editItem(`/Alumnos/${item.codigo}`, item, 'Alumno')" />
                                </v-list-item>
                                <v-list-item>
                                    <DeleteDialog
                                        :description="`¿Está seguro de querer eliminar el usuario '${item.nombre}'?`"
                                        :index="index" :item="item.codigo" :itemUrl="`/Alumnos/${item.codigo}`"
                                        :list="'Alumnos'" />
                                </v-list-item>
                            </v-list>
                        </v-menu>
                        <!--
                        <v-btn v-text="'Editar'" color="blue" text small :to="{ path: `/Usuarios/${item.codigo}`,
                    query: { url: `/Alumnos/${item.codigo}`, rol_usuario: 'Alumno'}}" />
                    <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}'?`"
                        :itemUrl="`/Alumnos/${item.codigo}`" :index="index" list="alumnos" :item="item.codigo"/>
                    -->
                    </template>
                </v-data-table>
            </v-card>
        </v-container>

    </v-container>
</template>

<script lang="ts">
// @ts-nocheck
import Vue from "vue"
import { clave } from '@/plugins/globals';
const CryptoJS = require("crypto-js");
export default Vue.extend({

    name: 'Usuarios',
    middleware: 'auth',

    data: () => ({
        rol: "",
        administradores: [],
        maestros: [],
        alumnos: [],
        headerProps: {
            sortByText: "Ordenar por"
        },
        headers: [
            { text: 'Codigo', value: 'codigo' },
            { text: 'Nombre', value: 'nombre' },
            { text: 'Email', value: 'email' },
            { text: 'Telefono', value: 'telefono' },
            { text: 'Acciones', value: 'actions' },
        ],
    }
    ),


    async beforeMount() {
        this.$nuxt.$on('remove-from-list', this.deleteElement)
        this.$store.commit('setTitle', 'Usuarios')
        try {
            const response = await this.$axios.get('/login')
            this.rol = response.data.rol
            if (this.rol !== 'administrador') {
                return
            }
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error)
        }
        try {
            const response = await this.$axios.get('/Maestros/Admins')
            this.administradores = response.data.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error)
        }
        try {
            const response = await this.$axios.get('/Maestros')
            this.maestros = response.data.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error)
        }
        try {
            const response = await this.$axios.get('/Alumnos')
            this.alumnos = response.data.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error)
        }


    },

    methods: {
        deleteElement(index: number, list: string) {
            switch (list) {
                case 'Administradores':
                    this.administradores.splice(index, 1);
                    break;
                case 'Maestros':
                    this.maestros.splice(index, 1);
                    break;
                case 'Alumnos':
                    this.alumnos.splice(index, 1);
                    break;
                default:
                    break;
            }
        },

        editItem(Url: string, item: any, Rol: string) {
            const url = CryptoJS.AES.encrypt(Url, clave).toString();
            const rol = CryptoJS.AES.encrypt(Rol, clave).toString();
            const codigo = CryptoJS.AES.encrypt(item.codigo.toString(), clave).toString();
            localStorage.setItem("codigo", codigo)
            localStorage.setItem("url", url)
            localStorage.setItem("rol", rol)
            this.$router.push(`/Usuarios/${item.codigo}`)
        },
    },

})

</script>
  
<style>
.custom-v-card {
    margin-top: 0px;
    padding: 20px;
    background-color: whitesmoke;
    box-shadow: 0 0 20px black;
}

.custom-data-table-usuario {
    border-style: solid;
    border-width: 2px;
    border-color: #64B5F6;
}

/* Estiliza los encabezados de la tabla */
.custom-data-table-usuario .v-data-table-header th {
    background-color: #64B5F6;
    /* Color de fondo más oscuro para los encabezados */
    color: white;
    /* Color del texto en los encabezados */
}

/* Estiliza las filas alternas */
.custom-data-table-usuario tbody tr:nth-of-type(odd) {
    background-color: #fff;
    /* Fondo gris claro para filas impares */
}

.custom-data-table-usuario tbody tr:nth-of-type(even) {
    background-color: #c7eeff;
    /* Fondo blanco para filas pares */
}

.custom-data-table-usuario .v-data-footer {
    background-color: #e1e2e3;
}


.custom-data-table-usuario .v-data-table-header {
    color: white;
}</style>