<template>
    <v-container>
        <v-form @submit.prevent="guardar" >
            <v-card>
                <v-card-title>
                    Entrega de tarea
                </v-card-title>
                <v-file-input v-model="archivo" label="Seleccionar archivo"></v-file-input>
                <input type="hidden" :value="alumno" name="ANombre" />
                <input type="hidden" :value="nombre" name="nombre" />
                <v-btn @click="enviarArchivo" color="primary">Enviar archivo</v-btn>
                <v-card-actions>
                    <v-spacer />
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
    name: 'TareaEntrega',
    middleware: 'auth',
    data: () => ({
        roles: {},
        archivo: null,
        id: "",
        alumno: "",
        tarea: {
            entregada: Number
        },
    }),

    async beforeMount() {
        this.id = this.$route.query.id
        try {
            const responseR = await this.$axios.get('/login')
            this.roles = responseR.data
            const res = await this.$axios.get(`/Alumnos/${this.roles.codigo}`)
            this.alumno = res.data.data.nombre
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
       async enviarArchivo() {
            const formData = new FormData()
            formData.append('archivo', this.archivo)
            try {
                const restar =  await this.$axios.get(`/Tareas/${this.id}`)
                const respro = await this.$axios.get(`/Proyectos/${restar.data.data.Proyecto_id}`)
                const response = await this.$axios.post(`Tarea/Entrega/${this.id}/${this.alumno}/${restar.data.data.nombre}/${respro.data.data.nombre}`, formData)
                this.tarea.entregada=1
                const res =  await this.$axios.put(`/Tareas/${this.id}`, this.tarea)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
            
            this.$router.push('/Tareas')
        },
        cancelar() {
            window.history.back();
        }
    }
}

</script>