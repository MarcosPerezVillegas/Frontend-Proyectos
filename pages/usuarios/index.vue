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
                    <v-btn v-text="'Editar'" color="blue" text small :to="`/Administradores/${item.codigo}`" />
                    <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}'?`"
                        :itemUrl="`/Administradores/${item.codigo}`" :index="index" list="administradores" />
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
                    <v-btn v-text="'Editar'" color="blue" text small :to="`/Maestros/${item.codigo}`" />
                    <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}'?`"
                        :itemUrl="`/Maestros/${item.codigo}`" :index="index" list="maestros" />
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
                    <v-btn v-text="'Editar'" color="blue" text small :to="`/Alumnos/${item.codigo}`" />
                    <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}'?`"
                        :itemUrl="`/Alumnos/${item.codigo}`" :index="index" list="alumnos" />
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
            const response = await this.$axios.get('/Administradores')
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
  