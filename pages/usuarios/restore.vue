<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/v-slot-style -->
<template>
    <v-container>
        <v-card-title>
            Lista de todos los usuarios que han sido eliminados
        </v-card-title>
        <v-row>
            <v-spacer />
            <v-btn to="/Usuarios">Cancelar</v-btn>
        </v-row>
        <br>
        <v-card-title>
            Administradores
        </v-card-title>
        <v-card>
            <v-data-table :items="administradores" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-menu offset-y>
                        <template #activator="{ on }">
                            <v-btn v-text="'Acciones'" color="orange" text small v-on="on" />
                        </template>
                        <v-list>
                            <v-list-item>
                                <RestoreDialog :description="`¿Está seguro de querer restaurar el Usuario '${item.nombre}'?`"
                                    :itemUrl="`/Maestros/Restaurar/${item.codigo}`" :index="index" list="Administradores" />
                            </v-list-item>
                            <v-list-item>
                                <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}'
                                    de manera permanente? esta acción no se puede deshacer`" :index="index"
                                    :item="item.codigo" :itemUrl="`/Maestros/Eliminados/${item.codigo}`" :list="'Administradores'" />
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
        <v-card>
            <v-data-table :items="maestros" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-menu offset-y>
                        <template #activator="{ on }">
                            <v-btn v-text="'Acciones'" color="orange" text small v-on="on" />
                        </template>
                        <v-list>
                            <v-list-item>
                                <RestoreDialog :description="`¿Está seguro de querer restaurar el Usuario '${item.nombre}'?`"
                                    :itemUrl="`/Maestros/Restaurar/${item.codigo}`" :index="index" list="Maestros" />
                            </v-list-item>
                            <v-list-item>
                                <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}'
                                    de manera permanente? esta acción no se puede deshacer`" :index="index"
                                    :item="item.codigo" :itemUrl="`/Maestros/Eliminados/${item.codigo}`" :list="'Maestros'" />
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
        <v-card>
            <v-data-table :items="alumnos" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-menu offset-y>
                        <template #activator="{ on }">
                            <v-btn v-text="'Acciones'" color="orange" text small v-on="on" />
                        </template>
                        <v-list>
                            <v-list-item>
                                <RestoreDialog :description="`¿Está seguro de querer restaurar el Usuario '${item.nombre}'?`"
                                    :itemUrl="`/Alumnos/Restaurar/${item.codigo}`" :index="index" list="Alumnos" />
                            </v-list-item>
                            <v-list-item>
                                <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}'
                                    de manera permanente? esta acción no se puede deshacer`" :index="index"
                                    :item="item.codigo" :itemUrl="`/Alumnos/Eliminados/${item.codigo}`" :list="'Alumnos'" />
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
</template>

<script lang="ts">

// @ts-nocheck

export default {

    name: 'Usuarios',
    middleware: 'auth',

    data: () => ({
        administradores: [],
        maestros: [],
        alumnos: [],
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
  