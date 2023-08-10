<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-card v-if="entregada === 1">
                <v-card-actions>
                    <p>Ya Entregaste esta tarea</p>
                    <v-spacer />
                    <v-btn @click="cancelar()" color="blue">
                        Cancelar
                    </v-btn>
                </v-card-actions>
            </v-card>
            <v-card v-else-if="entrega < fecha">
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
            <v-card v-else>
                <v-card-actions>
                    <p>Ya no puedes hacer entregas de esta tarea</p>
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

const CryptoJS = require("crypto-js");

export default {
    name: 'TareaEntrega',
    middleware: 'auth',
    data: () => ({
        roles: {},
        archivo: null,
        id: "",
        alumno: "",
        fecha: "",
        entrega: "",
        tarea: {
            entregada: Number,
            entregante: ""
        },
        entregada: Number
    }),

    async beforeMount() {
        const clave = "Anitalabalatina"
        const idCifrado = localStorage.getItem("Tarea")
        const bytes = CryptoJS.AES.decrypt(idCifrado, clave);
        const idDescifrado = bytes.toString(CryptoJS.enc.Utf8);
        console.log("Mensaje descifrado:", idDescifrado);
        this.id = idDescifrado
        window.addEventListener('popstate', this.PopState);
        try {
            const responseR = await this.$axios.get('/login')
            this.roles = responseR.data
            const res = await this.$axios.get(`/Alumnos/${this.roles.codigo}`)
            this.alumno = res.data.data.nombre

            const hoy = new Date();
            const año = hoy.getFullYear();
            const mes = String(hoy.getMonth() + 1).padStart(2, '0');
            const dia = String(hoy.getDate()).padStart(2, '0');

            const horas = String(hoy.getHours()).padStart(2, '0');
            const minutos = String(hoy.getMinutes()).padStart(2, '0');
            const segundos = String(hoy.getSeconds()).padStart(2, '0');

            const fecha = `${año}-${mes}-${dia}`;
            const hora = `${horas}:${minutos}:${segundos}`;
            const date = `${fecha} ${hora}`
            const restar = await this.$axios.get(`/Tareas/${this.id}`)
            this.entregada = restar.data.data.entregada
            const fechalimite = `${restar.data.data.fecha_limite} ${restar.data.data.hora_limite}`;
            this.fecha = new Date(fechalimite)
            this.entrega = new Date(date)
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    beforeRouteLeave(to, from, next) {
        localStorage.removeItem("Tarea");
        next();
    },


    beforeDestroy() {
        window.removeEventListener('popstate', this.PopState);
    },

    methods: {
        async enviarArchivo() {
            if (this.archivo === null || this.archivo === '') {
                this.$nuxt.$emit('show-snackbar', 'red', 'Por favor, selecciona un archivo antes de enviarlo.');
                return;
            }
            const formData = new FormData()
            formData.append('archivo', this.archivo)
            try {
                const restar = await this.$axios.get(`/Tareas/${this.id}`)
                const respro = await this.$axios.get(`/Proyectos/${restar.data.data.Proyecto_id}`)
                const response = await this.$axios.post(`Tarea/Entrega/${this.id}/${this.alumno}/${restar.data.data.nombre}/${respro.data.data.nombre}`, formData)
                this.tarea.entregada = 1
                this.tarea.entregante = this.alumno
                const res = await this.$axios.put(`/Tareas/${this.id}`, this.tarea)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }

            this.$router.push('/Tareas')
        },

        PopState() {
            localStorage.removeItem("Tarea");
        },

        cancelar() {
            window.history.back();
        }
    }
}

</script>