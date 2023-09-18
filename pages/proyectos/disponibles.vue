<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/no-parsing-error -->
<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/v-slot-style -->
<template>
    <v-container>
        <v-btn color="red" to="/">Atras</v-btn>
        <br>
        <br>
        <v-card outlined>
            <v-card-title>
                Todos los Proyectos
            </v-card-title>
            <v-data-table :items="proyectos" :headers="headers">
                <template v-slot:item.statuses="item, index">
                    <span>
                        {{ item.item.statuses[item.item.statuses.length - 1].Estado }}
                    </span>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script lang="ts">

// @ts-nocheck

export default {
    name: 'ProyectosDisponibles',
    layout: 'inicio',

    data: () => ({
        proyectos: [],
        headers: [
            { text: 'Nombre', value: 'nombre' },
            { text: 'Estado actual del proyecto', value: 'statuses' },
            { text: 'Cupos restantes', value: 'alumnos' },
            { text: 'Objetivos del proyecto', value: 'objetivos' }
        ]
    }),

    async beforeMount() {
        this.$nuxt.$on('remove-from-list', this.deleteElement)
        this.$store.commit('setTitle', 'Proyectos')
        try {
            await this.$axios.get('/login')
            this.$router.push('/Proyectos')
        } catch { }
        try {
            const response = await this.$axios.get('/Proyectos')
            this.proyectos = response.data.data.filter(proyecto => {
                // Obtiene el último estado del arreglo statuses
                const ultimoEstado = proyecto.statuses[proyecto.statuses.length - 1];

                // Verifica si el último estado es "En espera" y excluye el proyecto si es cierto
                return (ultimoEstado && ultimoEstado.Estado === "Activo");
            });
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }

    },
}

</script>