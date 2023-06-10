<template>
    <v-container>
        <v-row>
            <v-spacer />
            <v-btn to="/Usuarios/Create">Registrar usuarios</v-btn>
        </v-row>
        <br>
        <v-card>
            <v-data-table :items="usuarios" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-btn v-text="'Editar'" color="blue" text small :to="`/Usuarios/${item.codigo}`" />
                    <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}'?`"
                        :itemUrl="`/Usuarios/${item.codigo}`" :index="index" />
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
        usuarios: [],
        headers: [
            { text: 'Codigo', value: 'codigo' },
            { text: 'Nombre', value: 'nombre' },
            { text: 'Email', value: 'email' },
            { text: 'Rol_id', value: 'rol_id' },
            { text: 'Telefono', value: 'telefono' },
            { text: 'Acciones', value: 'actions' },
        ]
    }),

    async beforeMount() {
        this.$nuxt.$on('remove-from-list', this.deleteElement)

        this.$store.commit('setTitle', 'Usuarios')
        try {
            const response = await this.$axios.get('/Usuarios')
            this.usuarios = response.data.data
        } catch (error) {

        }
    },

    methods: {
        deleteElement(index: number) {
            console.log(index)
            this.usuarios.pop(index)
        }
    }
}

</script>
  