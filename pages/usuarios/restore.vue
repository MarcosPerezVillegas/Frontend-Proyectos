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
        <v-card>
            <v-data-table :items="usuarios" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <RestoreDialog :description="`¿Está seguro de querer restaurar el Usuario '${item.nombre}'?`"
                        :itemUrl="`/Usuarios/Restaurar/${item.codigo}`" :index="index" />
                    <DeleteDialog :description="`¿Está seguro de querer eliminar el Usuario '${item.nombre}' de manera permanente?
                    esta acción no se puede deshacer`"
                    :itemUrl="`/Usuarios/Eliminados/${item.codigo}`" :index="index" />
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
        ],
    }),


    async beforeMount() {
        this.$nuxt.$on('remove-from-list', this.deleteElement)

        this.$store.commit('setTitle', 'Usuarios')
        try {
            const response = await this.$axios.get('/Usuarios/Eliminados')
            this.usuarios = response.data.data
        } catch (error) {

        }
        
    },

    methods: {
        deleteElement(index: number) {
            console.log(index)
            this.usuarios.splice(index,1)
        },
        async deleteUser(index: number, codigo:string){
            try {
                const response = await this.$axios.delete(`/Usuarios/Eliminados/${codigo}`)
                this.usuarios.splice(index,1)
            } catch (error) {   
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
            
        }
    }
}

</script>
  