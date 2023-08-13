<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-card>
                <v-card-title>
                    Crear una tarea
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="tarea.nombre" label="Nombre" :rules="[$validations.notEmpty]"></v-text-field>
                    <v-text-field v-model="tarea.descripcion" label="Descripcion"
                        :rules="[$validations.notEmpty]"></v-text-field>
                    <v-text-field v-model="tarea.comentarios" label="Comentarios del profesor"
                        :rules="[$validations.notEmpty]"></v-text-field>
                    <v-text-field v-model="tarea.fecha_limite" label="Fecha limite" type="date"
                        :rules="[$validations.notEmpty]"></v-text-field>
                    <v-text-field v-model="tarea.hora_limite" label="Hora limite" type="time"
                        :rules="[$validations.notEmpty]"></v-text-field>
                    <v-combobox v-model="estado" label="Estado de la tarea" :items="['Activo', 'Inactivo']"
                        :rules="[$validations.notEmpty]"></v-combobox>
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
            activo: Number
        },
        estado: ""
    }),
    async beforeMount() {
        try {
            const res = await this.$axios.get('/Login')
            const response = await this.$axios.get(`/Proyectos/Usuario/${res.data.codigo}`)
            const proyectos = response.data.data.map(proyecto => proyecto.nombre)
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },
    methods: {
        async guardar() {
            if (this.tarea.nombre === "" || this.tarea.descripcion === "" || this.tarea.comentarios === "" ||
                this.tarea.fecha_limite === "" || this.tarea.hora_limite === "" || this.estado === "") {
                return this.$nuxt.$emit('show-snackbar', 'red', "Llena los espacios requeridos")
            }
            try {
                this.tarea.Proyecto_id = parseInt(this.$route.query.id)
                try {
                    if (this.estado === "Activo") {
                        this.tarea.activo = 1
                    } else {
                        this.tarea.activo = 0
                    }
                    const resTar = await this.$axios.get(`/Tareas/Nombre/${this.tarea.nombre}`)
                    const tareas = resTar.data.data
                    for (const tarea of tareas) {
                        if (tarea.Proyecto_id === this.tarea.Proyecto_id) {
                            return this.$nuxt.$emit('show-snackbar', 'red', "Ya existe una tarea con ese nombre")
                        }
                    }
                } catch { }

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