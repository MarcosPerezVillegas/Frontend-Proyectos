<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
    <v-container>
        <v-container v-if="rol === 'alumno'" justify-center align-center>
            <v-card>
                <v-card-title>Acceso Denegado</v-card-title>
                <v-card-text>
                    <p>No tienes el rol necesario para acceder a esta página.</p>
                </v-card-text>
            </v-card>
        </v-container>
        <v-container v-else>
            <v-container v-if="ver === 'true'">
                <v-card>
                    <v-card-title>
                        Nombre de la tarea: {{ tarea.nombre }}
                    </v-card-title>
                    <v-card-text style="font-size: larger;">
                        Descripción de la tarea: {{ tarea.descripcion }}
                    </v-card-text>
                    <v-card-text v-if="tarea.comentarios !== ''">
                        Comentarios del profesor: {{ tarea.comentarios }}
                    </v-card-text>
                </v-card>
                <br>
                <v-card class="text-center">
                    <br>
                    <br>
                    <v-btn v-if="entregada" v-text="'Descargar Archivo'" color="primary" @click="descargarArchivo" />
                    <p v-else class="text-center" style="font-size: larger;">Esta tarea no tiene archivos para descargar</p>
                    <br>
                    <br>
                </v-card>
                <br>
                <v-spacer /> <v-btn v-text="'Atras'" color="primary" @click="cancelar()" />
            </v-container>
            <v-form v-else @submit.prevent="guardar">
                <v-card>
                    <v-card-title>
                        Editar tarea
                    </v-card-title>
                    <v-card-text>
                        <v-combobox v-model="proyecto" outlined label="Proyecto al que quieras reasignar la tarea" :items="Proyectos"
                            :rules="[$validations.notEmpty]"></v-combobox>
                        <v-text-field v-model="tarea.nombre" outlined label="Nombre" :rules="[$validations.notEmpty]"></v-text-field>
                        <v-textarea v-model="tarea.descripcion" outlined style="overflow-y: auto; max-block-size: 300px; "
                            label="Descripcion" :rules="[$validations.notEmpty]"></v-textarea>
                        <v-textarea v-model="tarea.comentarios" outlined style="overflow-y: auto; max-block-size: 300px; "
                            label="Comentarios del profesor"></v-textarea>
                        <v-text-field v-model="tarea.fecha_limite" outlined label="Fecha limite" type="date"
                            :rules="[$validations.notEmpty]"></v-text-field>
                        <v-text-field v-model="tarea.hora_limite" outlined label="Hora limite" type="time"
                            :rules="[$validations.notEmpty]"></v-text-field>
                        <v-combobox v-model="estado" outlined label="Estado de la tarea" :items="['Activo', 'Inactivo']"
                            :rules="[$validations.notEmpty]"></v-combobox>
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
    </v-container>
</template>

<script lang="ts">

// @ts-nocheck

export default {
    name: 'TareasUpdate',
    middleware: 'auth',
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
        estado: "",
        proyecto: "",
        id: "",
        Proyectos: [""],
        nombre: "",
        ver: "",
        archivo: "",
        entregada: null
    }),

    async beforeMount() {
        const id = this.$route.params.id
        this.ver = localStorage.getItem("ver")
        const res = await this.$axios.get('/Login')
        this.rol = res.data.rol
        try {
            const response = await this.$axios.get(`/Tareas/${id}`)
            this.tarea = response.data.data
            const respon = await this.$axios.get(`/Proyectos/${this.tarea.Proyecto_id}`)
            this.id = this.tarea.Proyecto_id
            this.proyecto = respon.data.data.nombre
            if (this.ver === "true") {
                try {
                    await this.$axios.get(`/Tarea/Cargar/${this.tarea.id}/${this.tarea.Proyecto_id}`, {
                        responseType: 'arraybuffer',
                    })
                    this.entregada = true
                } catch {

                }

            } else {
                if (this.tarea.activo === 0) {
                    this.estado = 'Inactivo'
                } else {
                    this.estado = 'Activo'
                }
                this.nombre = this.tarea.nombre
                const respons = await this.$axios.get(`/Proyectos/Usuario/${respon.data.data.codigo}`)
                const proyectos = respons.data.data.map(proyecto => proyecto.nombre)
                this.Proyectos = proyectos
            }
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        async guardar() {
            if (this.tarea.nombre === "" || this.tarea.descripcion === "" ||
                this.tarea.fecha_limite === "" || this.tarea.hora_limite === "" || this.proyecto === null || this.estado === "") {
                return this.$nuxt.$emit('show-snackbar', 'red', "Llena los espacios requeridos")
            }
            try {
                if (this.nombre !== this.tarea.nombre) {
                    try {
                        const resTar = await this.$axios.get(`/Tareas/Nombre/${this.tarea.nombre}`)
                        if (resTar) {
                            return this.$nuxt.$emit('show-snackbar', 'red', "Ya existe una tarea con ese nombre")
                        }
                    } catch { }
                }
                if (this.estado === "Activo") {
                    this.tarea.activo = 1
                } else {
                    this.tarea.activo = 0
                }
                const resPro = await this.$axios.get(`/Proyectos/Nombre/${this.proyecto}`)
                this.tarea.Proyecto_id = resPro.data.data.id
                const response = await this.$axios.put(`/tareas/${this.tarea.id}`, this.tarea)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                this.$router.push('/Tareas')
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        },

        async descargarArchivo() {
            try {
                const res = await this.$axios.get(`/Tarea/Cargar/${this.tarea.id}/${this.id}`, {
                    responseType: 'arraybuffer',
                })
                const contentType = res.headers['content-type']
                const ext = contentType.split('/')[1];
                const blob = new Blob([res.data], { type: contentType })
                const url = URL.createObjectURL(blob)

                const link = document.createElement('a')
                link.href = url
                link.target = '_blank'
                link.download = `${this.tarea.nombre}.${ext}`
                link.click()
                URL.revokeObjectURL(url)
            } catch {
                this.$nuxt.$emit('show-snackbar', 'red', 'No hay archivo disponible para descargar');
            }
        },


        cancelar() {
            window.history.back()
        }
    }
}

</script>