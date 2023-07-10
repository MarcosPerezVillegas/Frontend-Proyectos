<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-card>
                <v-card-title>
                    Crear una tarea
                </v-card-title>
                <v-card-text>
                    <v-combobox v-model="proyecto" label="Proyecto al que quieras crear la tarea"
                        :items="Proyectos"></v-combobox>
                    <v-text-field v-model="tarea.nombre" label="Nombre"></v-text-field>
                    <v-text-field v-model="tarea.descripcion" label="Descripcion"></v-text-field>
                    <v-text-field v-model="tarea.comentarios" label="Comentarios"></v-text-field>
                    <v-text-field v-model="tarea.fecha_limite" label="Fecha limite" type="date"></v-text-field>
                    <v-text-field v-model="tarea.hora_limite" label="Hora limite" type="time"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="cancelar()">
                        Cancelar
                    </v-btn>
                    <v-btn type="submit">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
</template>

<script lang="ts">

export default {
    name: 'UsuariosCreate',


    data: () => ({
        tarea: {
            Proyecto_id: "",
            nombre: "",
            descripcion: "",
            comentarios: "",
            fecha_limite: "",
            hora_limite: "",

        },
        proyecto: "",
        Proyectos: [""]
    }),
    async beforeMount() {
        try {
            const res = await this.$axios.get('/login')
            const response = await this.$axios.get(`/proyectos/usuario/${res.data.codigo}`)
            const proyectos = response.data.data.map(proyecto => proyecto.nombre)
            this.Proyectos = proyectos
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },
    methods: {
        async guardar() {
            try {
                const resPro = await this.$axios.get(`/Proyectos/Nombre/${this.proyecto}`)
                this.tarea.Proyecto_id = resPro.data.data.id
                const response = await this.$axios.post('/tareas', this.tarea)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                this.$router.push('/tareas')
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        },

        cancelar() {
            this.$router.push('/tareas')
        },

    }
}

</script>