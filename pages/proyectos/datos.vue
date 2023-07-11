<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-row>
                <v-spacer />
                <v-btn v-if="roles.rol == 'maestro' || roles.rol == 'administrador'" @click="cancelar()" color="red">
                    Regresar
                </v-btn>
            </v-row>
            <br>
            <v-card>
                <v-card-title>
                    {{proyecto.nombre}}
                </v-card-title>
                <v-card-text>
                    {{maestro}}
                    <v-spacer />
                    {{carrera}}
                </v-card-text>
                <v-card-text v-if="roles.rol == 'maestro' || roles.rol == 'administrador'">
                    ALumnos Participantes: {{carrera}}
                </v-card-text>
            </v-card>
            <br>
            <v-card>
                <v-card-title>
                    Objetivos
                </v-card-title>
                <v-card-text>
                    {{proyecto.objetivos}}
                </v-card-text>
                <v-card-title>
                    Fecha de Entrega
                </v-card-title>
                <v-card-text>
                    {{proyecto.fechafinal}}
                </v-card-text>
            </v-card>
            <br>
            <v-card>
                <v-card-title>
                    Tareas
                </v-card-title>
                <v-data-table :items="tareas" :headers="headers">
                    <template v-slot:item.actions="{ item, index }">
                        <v-btn v-text="'Ver tarea'" color="blue" text small :to="`/Tareas/entrega`" />
                    </template>
                </v-data-table>
            </v-card>
        </v-form>
    </v-container>
</template>

<script lang="ts">

export default {
    name: 'ProyectosDatos',
    middleware: 'auth',
    data: () => ({
        roles: {},
        proyecto: {},
        maestro: "",
        carrera: "",
        tareas: [],
        headers: [
            { text: 'Nombre', value: 'nombre' },
            { text: 'Fecha de entrega', value: 'fecha_limite' },
            { text: 'Hora de entrega', value: 'hora_limite' },
            { text: 'Acciones', value: 'actions' },
        ]
    }),

    async beforeMount() {
        this.$store.commit('setTitle', 'Proyectos')
        const id = localStorage.getItem('proId')
        
        try {
            const response = await this.$axios.get(`/proyectos/${id}`)
            this.proyecto = response.data.data
            this.carrera = this.proyecto.Carrera.nombre
            this.maestro = this.proyecto.encargado.nombre
            const responseT = await this.$axios.get(`/tareas/proyecto/${id}`)
            this.tareas = responseT.data.data
            console.log(this.tareas)
            console.log(responseT.data)
            const responseR = await this.$axios.get('/login')
            this.roles = responseR.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        cancelar() {
            this.$router.push('/proyectos')
        }
    }
}

</script>