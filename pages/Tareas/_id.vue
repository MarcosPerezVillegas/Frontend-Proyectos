<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
    <v-container>
        <v-container v-if="access" justify-center align-center>
            <v-card style="margin-top: 0px; padding: 20px; background-color: whitesmoke; box-shadow: 0 0 20px black;">
                <v-card-title><b>Acceso denegado</b></v-card-title>
                <v-card-text>
                    <b>No tienes el rol necesario para acceder a esta página.</b>
                </v-card-text>
            </v-card>
        </v-container>
        <v-container v-else>
            <v-container v-if="ver === 'true'" class="mt-5">
                <v-form class="custom-v-form-edit">
                    <v-card>
                        <v-card-title class="headline">
                            {{ tarea.nombre }}
                        </v-card-title>
                        <v-card-text style="border-width: 1px; border-style: solid; border-color: gray;">
                            <p></p>
                            <b style="font-size: medium;">Descripción de la tarea:</b>
                            <p class="text-body-1">
                                {{ tarea.descripcion }}
                            </p>
                        </v-card-text>
                        <br>
                        <v-card-text v-if="tarea.comentarios !== ''"
                            style="border-width: 1px; border-style: solid; border-color: gray;">
                            <b style="font-size: medium;">Comentarios del profesor:</b>
                            <p>{{ tarea.comentarios }}</p>
                        </v-card-text>
                        <br>
                        <v-row class="text-center">
                            <v-card-text v-if="entregada" class="mb-3" justify="center">
                                <b style="font-size: medium;">Descargar la tarea del alumno</b>
                            </v-card-text>
                        </v-row>
                        <v-row justify="center">
                            <v-btn rounded v-if="entregada" color="primary" @click="descargarArchivo">
                                <v-icon small>
                                    mdi-download
                                </v-icon>
                                Descargar Archivo
                            </v-btn>
                        </v-row>
                        <v-row class="text-center">
                            <v-card-text v-if="!entregada" class="mb-3" justify="center">
                                <b style="font-size: medium;">Esta tarea no tiene archivos para descargar.</b>
                            </v-card-text>
                        </v-row>
                        <br>
                        <br>
                    </v-card>
                </v-form>
                <v-row class="mt-3" justify="center">
                    <v-btn rounded color="#FF0000" class="white--text" @click="cancelar()">
                        <v-icon>
                            mdi-keyboard-backspace
                        </v-icon>
                        Atrás
                    </v-btn>
                </v-row>
            </v-container>
            <v-form v-else @submit.prevent="validarTamañoArchivo()" class="custom-v-form-edit" style="border-radius: 2%;">
                <v-card>
                    <v-card-title class="headline">
                        <b>Editar tarea</b>
                    </v-card-title>
                    <v-card-text>
                        <v-alert ref="nombre" v-show="data.nombre" color="error" icon="$error">
                            El nombre de la tarea es necesaria.
                        </v-alert>

                        <v-alert ref="fecha" v-show="data.fecha" color="error" icon="$error">
                            La fecha de entrega de la tarea es necesaria.
                        </v-alert>

                        <v-alert ref="hora" v-show="data.hora" color="error" icon="$error">
                            La hora de entrega de la tarea es necesaria.
                        </v-alert>

                        <v-row>
                            <v-col cols="12" md="4">
                                <v-text-field v-model="tarea.nombre" outlined label="Nombre"
                                    :rules="[$validations.notEmpty]"></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-text-field v-model="tarea.fecha_limite" outlined label="Fecha limite" type="date"
                                    :rules="[$validations.notEmpty]"></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-text-field v-model="tarea.hora_limite" outlined label="Hora limite" type="time"
                                    :rules="[$validations.notEmpty]"></v-text-field>
                            </v-col>
                        </v-row>

                        <v-alert ref="descripcion" v-show="data.descripcion" color="error" icon="$error">
                            La descripcion de la tarea es necesaria.
                        </v-alert>

                        <v-textarea v-model="tarea.descripcion" outlined class="textarea-custom" label="Descripcion"
                            :rules="[$validations.notEmpty]"></v-textarea>

                        <v-textarea v-model="tarea.comentarios" outlined class="textarea-custom"
                            label="Comentarios del profesor"></v-textarea>

                        <v-alert ref="file" v-show="data.file" color="error" icon="$error">
                            El archivo no debe superar los 50mb.
                        </v-alert>

                        <v-card outlined
                            style="margin-top: 0px; padding: 20px; background-color: whitesmoke; box-shadow: 0 0 2px black;">
                            <v-text style="font-size: larger;">Subir material de apoyo</v-text>
                            <br>
                            <v-text style="font-size: small; font-style: oblique;">No mayor a 50mb</v-text>
                            <v-file-input v-model="archivo" label="Seleccionar archivo"
                                :rules="[$validations.isFileLessThan50MB]"></v-file-input>
                        </v-card>
                        <br>
                        <v-alert ref="estado" v-show="data.activo" color="error" icon="$error">
                            El Estado de la tarea en nesesario.
                        </v-alert>

                        <v-combobox v-model="estado" outlined label="Estado de la tarea" :items="['Activo', 'Inactivo']"
                            :rules="[$validations.notEmpty]"></v-combobox>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn @click="cancelar()" dark rounded class="white--text" color="#FF0000">
                            <v-icon>
                                mdi-cancel
                            </v-icon>
                            Cancelar
                        </v-btn>
                        <v-btn dark rounded class="white--text" type="submit" color="#43B63B">
                            <v-icon>
                                mdi-checkbox-marked-circle
                            </v-icon>
                            Guardar
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
        data: {
            nombre: false,
            descripcion: false,
            fecha: false,
            hora: false,
            activo: false,
            file: false
        },
        access: false,
        archivo: null,
        tareaId: 0,
        estado: "",
        proyecto: "",
        id: "",
        Proyectos: [""],
        nombre: "",
        ver: "",
        // archivo: "",
        entregada: null
    }),

    watch: {
        tarea: {
            deep: true,
            handler() {
                this.data.nombre = false
                this.data.descripcion = false
                this.data.fecha = false
                this.data.hora = false
                this.data.activo = false
                this.data.file = false
            }
        },
        estado: {
            deep: true,
            handler() {
                this.data.file = false
            }
        },
        archivo: {
            deep: true,
            handler() {
                this.data.file = false
            }
        }
    },

    async beforeMount() {
        const id = this.$route.params.id
        this.ver = localStorage.getItem("ver")
        const res = await this.$axios.get('/Login')
        this.rol = res.data.rol
        if (this.rol === 'alumno') {
            this.access = true
            return
        }
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

        scrollHaciaAlerta(elemento) {
            if (elemento && elemento.$el) {
                const offset = elemento.$el.offsetTop;
                window.scrollTo({
                    top: offset,
                    behavior: "smooth", // Esto hace que el desplazamiento sea suave
                });
            }
        },

        async validarTamañoArchivo() {
            try {
                if (this.tarea.nombre === "") {
                    this.data.nombre = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.nombre);
                    });
                    return
                }
                if (this.tarea.fecha_limite === "") {
                    this.data.fecha = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.fecha);
                    });
                    return
                }
                if (this.tarea.hora_limite === "") {
                    this.data.hora = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.hora);
                    });
                    return
                }
                if (this.tarea.descripcion === "") {
                    this.data.descripcion = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.descripcion);
                    });
                    return
                }
                if (this.archivo) {
                    const tamañoMaximo = 50 * 1024 * 1024; // 50 MB (ajusta según tus necesidades)
                    if (this.archivo.size > tamañoMaximo) {
                        this.data.file = true
                        this.$nextTick(() => {
                            this.scrollHaciaAlerta(this.$refs.file);
                        });
                        return
                    }
                }
                if (this.estado === "" || this.estado === null) {
                    this.data.activo = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.activo);
                    });
                    return
                }
                const resTar = await this.$axios.get(`/Tareas`)
                this.tareas = resTar.data.data
                for (const tarea of this.tareas) {
                    if (tarea.Proyecto_id.toString() === this.tarea.Proyecto_id && tarea.nombre === this.tarea.nombre) {
                        return this.$nuxt.$emit('show-snackbar', 'red', "Ya existe una tarea con ese nombre")
                    }
                }
            } catch { }
            this.guardar()
        },

        async guardar() {

            try {
                if (this.estado === "Activo") {
                    this.tarea.activo = 1
                } else {
                    this.tarea.activo = 0
                }
                const response = await this.$axios.put(`/Tareas/${this.tarea.id}`, this.tarea)
                console.log(response.data.tareaActualizada.id)
                debugger
                this.tareaId = response.data.tareaActualizada.id
                debugger
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                this.enviarArchivo()
            } catch (error) {
                console.log(this.tareaId)
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        },

        async enviarArchivo() {
            const formData = new FormData()
            formData.append('archivo', this.archivo)
            try {
                const response = await this.$axios.post(`Tarea/Entrega/Material/${this.tareaId}/${this.tarea.Proyecto_id}`, formData)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
            this.$router.push('/Tareas')
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

<style>
.custom-v-form-edit {
    margin-top: 0px;
    padding: 20px;
    background-color: #e1fffd;
    box-shadow: 0 0 20px black;
}

.textarea-custom .v-label::before {
    content: unset;
    transform: translateY(-10px);
    /* Ajusta la posición vertical del label */
    font-size: 14px;
    /* Ajusta el tamaño de fuente del label */
}
</style>