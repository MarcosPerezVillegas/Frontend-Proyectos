<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-card>
                <v-card-title>
                    Registrate!!
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="tarea.id" label="ID"></v-text-field>
                    <v-text-field v-model="tarea.Proyecto_id" label="Proyecto_Id"></v-text-field>
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
            id: "",
            Proyecto_id: "",
            nombre: "",
            descripcion: "",
            comentarios: "",
            fecha_limite: "",
            hora_limite: "",
            
        }
    }),

    methods: {
        async guardar() {

            try {
                const response = await this.$axios.post('/tareas', this.tarea)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                this.$router.push('/tareas')
            } catch (error) {
            }
        },

        cancelar() {
            this.$router.push('/tareas')
        }
    }
}

</script>