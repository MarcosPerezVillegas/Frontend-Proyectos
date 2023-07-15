<template>
    <v-dialog v-model="selectDialog">
        <template v-slot:activator="{ on, attrs }">
            <v-btn v-text="'Crear tarea'" color="blue" v-bind="attrs" v-on="on" />
        </template>
        <v-card>
            <v-card-title>
                Proyectos
            </v-card-title>
            <v-card-text>
                Seleccione un proyecto a la cual quiera agregar la nueva tarea
            </v-card-text>
            <v-card-actions>
                <v-flex xs4>
                <v-btn v-for="proyecto in proyectos" :key="proyecto.id" v-text="proyecto.nombre" text small color="green"
                    @click="seleccionarProyecto(proyecto)" />
                </v-flex>
                <br>
                <v-spacer />
                <v-btn v-text="'Cancelar'" color="red" @click="selectDialog = false" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">

export default {
    name: "SelectDialog",

    props: {
        proyectos: {
            type: Array,
            required: true,
            default: []
        },
    },

    data: () => ({
        selectDialog: false
    }),

    methods: {
        seleccionarProyecto(proyecto) {
            this.selectDialog = false;
            this.$router.push({ path: '/Tareas/Create', query: { id: proyecto.id } });
        },
    }
}

</script>