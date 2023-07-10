<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-card>
                <v-card-title>
                    Editar tarea
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="tarea.id" label="ID"></v-text-field>
                    <v-combobox v-model="proyecto" label="Proyecto al que quieras reasignar la tarea"
                        :items="Proyectos"></v-combobox>
                    <v-text-field v-model="tarea.nombre" label="Nombre"></v-text-field>
                    <v-text-field v-model="tarea.descripcion" label="Descripcion"></v-text-field>
                    <v-text-field v-model="tarea.comentarios" label="Comentarios"></v-text-field>
                    <v-text-field v-model="tarea.fecha_limite" label="Fecha limite" type="date"></v-text-field>
                    <v-text-field v-model="tarea.hora_limite" label="Hora limite" type="time"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn type="submit">
                        Guardar
                    </v-btn>
                    <v-btn @click="cancelar()" color="red">
                        Cancelar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
</template>

<script lang="ts">

export default {
    name: 'TareasUpdate',
    middleware: 'auth',
    data: () => ({
        tarea: {
            id: "",
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
        const id = this.$route.params.id
        try {
            const response = await this.$axios.get(`/Tareas/${id}`)
            this.tarea = response.data.data
            const respon = await this.$axios.get(`/Proyectos/${this.tarea.Proyecto_id}`)
            const respons = await this.$axios.get(`/Proyectos/Usuario/${respon.data.data.codigo}`)
            const proyectos = respons.data.data.map(proyecto => proyecto.nombre)
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
                const response = await this.$axios.put(`/tareas/${this.tarea.id}`, this.tarea)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                this.$router.push('/tareas')
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        },

        cancelar() {
            this.$router.push('/tareas')
        }
    }
}

</script>