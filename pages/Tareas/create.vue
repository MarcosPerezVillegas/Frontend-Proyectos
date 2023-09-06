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
    </v-container>
</template>

<script lang="ts">

// @ts-nocheck

const CryptoJS = require("crypto-js");
export default {
    name: 'UsuariosCreate',


    data: () => ({
        rol: "",
        clave: "Anitalabalatina",
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
            this.rol = res.data.rol
            await this.$axios.get(`/Proyectos/Usuario/${res.data.codigo}`)
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
                const id = localStorage.getItem("ProId")
                const bytes = CryptoJS.AES.decrypt(id, this.clave);
                this.tarea.Proyecto_id = bytes.toString(CryptoJS.enc.Utf8);
                try {
                    if (this.estado === "Activo") {
                        this.tarea.activo = 1
                    } else {
                        this.tarea.activo = 0
                    }
                    const resTar = await this.$axios.get(`/Tareas/Nombre/${this.tarea.nombre}`)
                    const tareas = resTar.data.data
                    for (const tarea of tareas) {
                        if (tarea.Proyecto_id.toString() === this.tarea.Proyecto_id && tarea.nombre === this.tarea.nombre) {
                            return this.$nuxt.$emit('show-snackbar', 'red', "Ya existe una tarea con ese nombre")
                        }
                    }
                } catch { }

                const response = await this.$axios.post('/Tareas', this.tarea)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                this.$router.push('/Tareas')
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        },

        cancelar() {
            this.$router.push('/Tareas')
        },

    }
}

</script>