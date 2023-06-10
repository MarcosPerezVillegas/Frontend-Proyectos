<template>
    <v-container>
        <v-row>
            <v-spacer />
            <v-btn to="/proyectos/_id">Editar proyecto</v-btn>
            <v-btn to="/proyectos/create">Alta proyecto</v-btn>
        </v-row>
        <br>
        <v-card>
            <v-data-table :items="proyectos" :headers="headers">
                <template v-slot:item.actions="{ i, item }">
                    <v-btn v-text="'Editar'" color="blue" text small :to="`/proyectos/${item.id}`"/>
                    <DeleteDialog 
                        :description="`¿Está seguro de querer eliminar el proyecto '${item.nombre}'? Esta acción no se puede deshacer.`" 
                        :itemUrl="`/proyectos/${item.id}`"/>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script lang="ts">

export default {
    name: 'Proyectos',
    middleware: 'auth',

    data: () => ({
        proyectos: [],
        headers: [
            { text: 'ID', value: 'id' },
            { text: 'Nombre', value: 'nombre' },
            { text: 'Objetivos', value: 'objetivos' },
            { text: 'Fecha de inicio', value: 'fechainicio' },
            { text: 'Fecha final', value: 'fechafinal' },
            { text: 'Carrera', value: 'carrera_clave' },
        ]
    }),

    async beforeMount() {
        this.$nuxt.$on('remove-from-list', this.deleteElement)

        this.$store.commit('setTitle', 'Proyectos')
        try {
            const response = await this.$axios.get('/proyectos')
            this.proyectos = response.data.data
        } catch (error) {

        }
    },

    methods: {
        deleteElement(index: number) {
            this.proyectos.pop(index)
        }
    }
}

</script>