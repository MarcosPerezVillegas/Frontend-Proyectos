<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/v-slot-style -->
<template>
    <v-container>
        <v-container v-if="rol === 'alumno' || rol === 'maestro'" justify-center align-center>
            <v-card style="margin-top: 0px; padding: 20px; background-color: #c7eeff; box-shadow: 0 0 20px black;">
                <v-card-title class="headline"><b>Acceso denegado</b></v-card-title>
                <v-card-text>
                    <b>No tienes el rol necesario para acceder a esta página.</b>
                </v-card-text>
            </v-card>
        </v-container>
        <v-container v-else>
            <v-card-title class="headline" style="font-size: large;">
                <b>Listas de todos los usuarios que han sido eliminados</b>
            </v-card-title>
            <v-row>
                <v-spacer />
                <v-btn dark rounded color="#FF0000 " to="/Usuarios">
                    <v-icon small>
                        mdi-cancel
                    </v-icon>
                    Cancelar
                </v-btn>
            </v-row>
            <br>
            <v-card-title>
                <b>Administradores</b>
            </v-card-title>
            <v-card outlined class="custom-v-card" style="background-color: #c7eeff;">
                <v-data-table :items="administradores" :headers="headers" class="custom-data-table"
                    :header-props="headerProps" :footer-props="{ 'items-per-page-text': 'Elementos por pagina' }">
                    <template v-slot:item.actions="{ item, index }">
                        <v-menu offset-y>
                            <template #activator="{ on }">
                                <v-btn color="#64B5F6" text v-on="on" small>
                                    <v-icon small>
                                        mdi-format-list-bulleted-square
                                    </v-icon>
                                </v-btn>
                            </template>
                            <v-list style="background-color: #c7eeff;">
                                <v-list-item>
                                    <RestoreDialog
                                        :description="`¿Está seguro de querer restaurar el Usuario '${item.nombre}'?`"
                                        :itemUrl="`/Maestros/Restaurar/${item.codigo}`" :index="index"
                                        list="Administradores" />
                                </v-list-item>
                                <v-list-item>
                                    <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}'
                                    de manera permanente? esta acción no se puede deshacer`" :index="index"
                                        :item="item.codigo" :itemUrl="`/Maestros/Eliminados/${item.codigo}`"
                                        :list="'Administradores'" />
                                </v-list-item>
                            </v-list>
                        </v-menu>
                        <!--
                        <RestoreDialog :description="`¿Está seguro de querer restaurar el Usuario '${item.nombre}'?`"
                        :itemUrl="`/Maestros/Restaurar/${item.codigo}`" :index="index" list="administradores" />
                    <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}' de manera permanente?
                    esta acción no se puede deshacer`" :itemUrl="`/Maestros/Eliminados/${item.codigo}`" :index="index"
                        list="administradores" :item="item.codigo" />
                    -->
                    </template>
                </v-data-table>
            </v-card>
            <br>
            <v-card-title>
                Maestros
            </v-card-title>
            <v-card outlined class="custom-v-card" style="background-color: #c7eeff;">
                <v-data-table :items="maestros" :headers="headers" class="custom-data-table" :header-props="headerProps"
                    :footer-props="{ 'items-per-page-text': 'Elementos por pagina' }">
                    <template v-slot:item.actions="{ item, index }">
                        <v-menu offset-y>
                            <template #activator="{ on }">
                                <v-btn color="#64B5F6" text v-on="on" small>
                                    <v-icon small>
                                        mdi-format-list-bulleted-square
                                    </v-icon>
                                </v-btn>
                            </template>
                            <v-list style="background-color: #c7eeff;">
                                <v-list-item>
                                    <RestoreDialog
                                        :description="`¿Está seguro de querer restaurar el Usuario '${item.nombre}'?`"
                                        :itemUrl="`/Maestros/Restaurar/${item.codigo}`" :index="index" list="Maestros" />
                                </v-list-item>
                                <v-list-item>
                                    <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}'
                                    de manera permanente? esta acción no se puede deshacer`" :index="index"
                                        :item="item.codigo" :itemUrl="`/Maestros/Eliminados/${item.codigo}`"
                                        :list="'Maestros'" />
                                </v-list-item>
                            </v-list>
                        </v-menu>
                        <!--
                        <RestoreDialog :description="`¿Está seguro de querer restaurar el Usuario '${item.nombre}'?`"
                        :itemUrl="`/Maestros/Restaurar/${item.codigo}`" :index="index" list="maestros" />
                    <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}' de manera permanente?
                    esta acción no se puede deshacer`" :itemUrl="`/Maestros/Eliminados/${item.codigo}`" :index="index"
                        list="maestros" :item="item.codigo" />
                    -->
                    </template>
                </v-data-table>
            </v-card>
            <br>
            <v-card-title>
                Alumnos
            </v-card-title>
            <v-card outlined class="custom-v-card" style="background-color: #c7eeff;">
                <v-data-table :items="alumnos" :headers="headers" class="custom-data-table" :header-props="headerProps"
                    :footer-props="{ 'items-per-page-text': 'Elementos por pagina' }">
                    <template v-slot:item.actions="{ item, index }">
                        <v-menu offset-y>
                            <template #activator="{ on }">
                                <v-btn color="#64B5F6" text v-on="on" small>
                                    <v-icon small>
                                        mdi-format-list-bulleted-square
                                    </v-icon>
                                </v-btn>
                            </template>
                            <v-list style="background-color: #c7eeff;">
                                <v-list-item>
                                    <RestoreDialog
                                        :description="`¿Está seguro de querer restaurar el Usuario '${item.nombre}'?`"
                                        :itemUrl="`/Alumnos/Restaurar/${item.codigo}`" :index="index" list="Alumnos" />
                                </v-list-item>
                                <v-list-item>
                                    <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}'
                                    de manera permanente? esta acción no se puede deshacer`" :index="index"
                                        :item="item.codigo" :itemUrl="`/Alumnos/Eliminados/${item.codigo}`"
                                        :list="'Alumnos'" />
                                </v-list-item>
                            </v-list>
                        </v-menu>
                        <!--
                        <RestoreDialog :description="`¿Está seguro de querer restaurar el Usuario '${item.nombre}'?`"
                        :itemUrl="`/Alumnos/Restaurar/${item.codigo}`" :index="index" list="alumnos"/>
                    <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}' de manera permanente?
                    esta acción no se puede deshacer`" :itemUrl="`/Alumnos/Eliminados/${item.codigo}`" :index="index"
                        list="alumnos" :item="item.codigo"/>
                    -->
                    </template>
                </v-data-table>
            </v-card>
        </v-container>

    </v-container>
</template>

<script lang="ts">

// @ts-nocheck

export default {

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
    }),


    async beforeMount() {
        this.$nuxt.$on('remove-from-list', this.deleteElement)

        this.$store.commit('setTitle', 'Usuarios')
        try {
            const respons = await this.$axios.get('/login')
            this.rol = respons.data.rol
            if (this.rol !== 'administrador') {
                return
            }
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error)
        }
        try {
            const response = await this.$axios.get('/Maestros/Admins/Eliminados')
            this.administradores = response.data.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error)
        }
        try {
            const response = await this.$axios.get('/Maestros/Eliminados')
            this.maestros = response.data.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error)
        }
        try {
            const response = await this.$axios.get('/Alumnos/Eliminados')
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
    }
}

</script>
  
<style>
.custom-v-card {
    margin-top: 0px;
    padding: 20px;
    background-color: whitesmoke;
    box-shadow: 0 0 20px black;
}

.custom-data-table {
    border-style: solid;
    border-width: 2px;
    border-color: #64B5F6;
}

/* Estiliza los encabezados de la tabla */
.custom-data-table .v-data-table-header th {
    background-color: #64B5F6;
    /* Color de fondo más oscuro para los encabezados */
    color: white;
    /* Color del texto en los encabezados */
}

/* Estiliza las filas alternas */
.custom-data-table tbody tr:nth-of-type(odd) {
    background-color: #fff;
    /* Fondo gris claro para filas impares */
}

.custom-data-table tbody tr:nth-of-type(even) {
    background-color: #cfcfcf;
    /* Fondo blanco para filas pares */
}

.custom-data-table .v-data-footer {
    background-color: #ace7ff;
}


.custom-data-table .v-data-table-header {
    color: white;
}
</style>