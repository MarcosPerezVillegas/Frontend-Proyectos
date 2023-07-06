<template>
    <v-container>
        <v-card-title>
            Lista de todos los usuarios
        </v-card-title>
        <v-row>
            <v-spacer />
            <v-btn color="orange" to="/Usuarios/Restore">Recuperar usuarios</v-btn>
            <v-btn color="green" to="/Usuarios/Create">Registrar usuarios</v-btn>
        </v-row>
        <br>
        <v-card-title>
            Administradores
        </v-card-title>
        <v-card>
            <v-data-table :items="administradores" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-btn v-text="'Editar'" color="blue" text small :to="{ path: `/Usuarios/${item.codigo}`,
                    query: { url: `/Maestros/${item.codigo}`, rol_usuario: 'Administrador' } }" />
                    <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}'?`"
                        :itemUrl="`/Maestros/${item.codigo}`" :index="index" list="administradores" :item="item.codigo"/>
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
                    <v-btn v-text="'Editar'" color="blue" text small :to="{ path: `/Usuarios/${item.codigo}`,
                    query: { url: `/Maestros/${item.codigo}`, rol_usuario: 'Maestro'}}" />
                    <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}'?`"
                        :itemUrl="`/Maestros/${item.codigo}`" :index="index" list="maestros" :item="item.codigo"/>
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
                    <v-btn v-text="'Editar'" color="blue" text small :to="{ path: `/Usuarios/${item.codigo}`,
                    query: { url: `/Alumnos/${item.codigo}`, rol_usuario: 'Alumno'}}" />
                    <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}'?`"
                        :itemUrl="`/Alumnos/${item.codigo}`" :index="index" list="alumnos" :item="item.codigo"/>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script lang="ts">

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
    }
    ),


    async beforeMount() {
        this.$nuxt.$on('remove-from-list', this.deleteElement)
        this.$store.commit('setTitle', 'Usuarios')
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
                case 'administradores':
                    this.administradores.splice(index, 1);
                    break;
                case 'maestros':
                    this.maestros.splice(index, 1);
                    break;
                case 'alumnos':
                    this.alumnos.splice(index, 1);
                    break;
                default:
                    break;
            }
        }
    }
}

</script>
  