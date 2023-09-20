<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/no-parsing-error -->
<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/v-slot-style -->
<template>
    <v-container>
        <v-btn rounded dark color="red" to="/">
            <v-icon>
                mdi-arrow-left
            </v-icon>
            Atras
        </v-btn>
        <br>
        <br>
        <v-card-title>
            <b>Todos los Proyectos</b>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                label="Buscar proyecto"
                single-line
                hide-details
            ></v-text-field>
        </v-card-title>
        <v-card outlined>
            <v-data-table :items="proyectos" :headers="headers" class="rows-green" :search="search" :header-props="headerProps"
                :footer-props="{itemsPerPageText: 'Proyectos por página', pageText: '{0} - {1} de {2}'}">
                <template v-slot:item.statuses="item, index">
                    <span>
                        <v-chip :color="getColor(item.item.statuses[item.item.statuses.length - 1].Estado)" style="color: white">
                            {{ item.item.statuses[item.item.statuses.length - 1].Estado }}
                        </v-chip>
                    </span>
                </template>
                <template v-slot:no-results>
                    <v-alert :value="true" color="error">
                        No se encontraron resultados de "{{ search }}".
                    </v-alert>
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
        search: "",
        headerProps: {
            sortByText: "Ordenar por"
        },
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
    methods: {
        getColor (estado) {
            if (estado === 'Activo') return 'green'
            else if (estado === 'Terminado') return 'red'
            else return 'orange'
        },
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

</style>