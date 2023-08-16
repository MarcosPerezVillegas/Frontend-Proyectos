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
                    Maestro encargado: {{maestro}}
                    <v-spacer />
                    Carrera: {{carrera}}
                </v-card-text>
                <v-card-text>
                    ALumnos Participantes:
                    <v-card-text v-if="participantes.length == 0"> Ninguno </v-card-text>
                    <br> 
                    <li v-for="item in participantes">
                        {{item.nombre}}
                        <br>
                    </li>
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
            <v-card v-if="roles.rol == 'maestro' || roles.rol == 'administrador'">
                <v-card-title>
                    Tareas
                </v-card-title>
                <v-data-table :items="tareas" :headers="headers">
                    <template v-slot:item.actions="{ item, index }">
                        <v-btn v-text="'Ver tarea'" color="blue" text small @click="verItem(item)" />
                        <v-btn v-if="item.activo == 0" v-text="'Activar'" color="green" text small @click="activar(item.id)" />
                        <v-btn v-if="item.activo == 1" v-text="'Desactivar'" color="red" text small @click="desactivar(item.id)" />
                    </template>
                </v-data-table>
            </v-card>
            <v-card v-if="roles.rol == 'alumno'">
                <v-card-title>
                    Tareas
                </v-card-title>
                <v-data-table :items="tareas2" :headers="headers">
                    <template v-slot:item.actions="{ item, index }">
                        <v-btn v-text="'Ver tarea'" color="blue" text small @click="entregaTarea(item.id)" />
                    </template>
                </v-data-table>
            </v-card>
        </v-form>
    </v-container>
</template>

<script lang="ts">

const CryptoJS = require("crypto-js");

export default {
    name: 'ProyectosDatos',
    middleware: 'auth',
    data: () => ({
        roles: {},
        proyecto: {},
        maestro: "",
        id: "",
        carrera: "",
        participantes: [],
        tareas: [],
        tareas2: [],
        headers: [
            { text: 'Nombre', value: 'nombre' },
            { text: 'Fecha de entrega', value: 'fecha_limite' },
            { text: 'Hora de entrega', value: 'hora_limite' },
            { text: 'Acciones', value: 'actions' },
        ]
    }),

    async beforeMount() {
        this.$store.commit('setTitle', 'Proyectos')
        const clave = "Anitalabalatina"
        const idCifrado = localStorage.getItem("proId")
        const bytes = CryptoJS.AES.decrypt(idCifrado, clave);
        const idDescifrado = bytes.toString(CryptoJS.enc.Utf8);
        this.id = idDescifrado
        
        try {
            const response = await this.$axios.get(`/proyectos/${this.id}`)
            this.proyecto = response.data.data
            this.carrera = this.proyecto.Carrera.nombre
            this.maestro = this.proyecto.encargado.nombre
            this.participantes = this.proyecto.Alumnos
            const responseT = await this.$axios.get(`/tareas/proyecto/${this.id}`)
            this.tareas = responseT.data.data
            const ta2 = this.tareas.filter(item => item.activo == 1)
            this.tareas2 = ta2
            const responseR = await this.$axios.get('/login')
            this.roles = responseR.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        async activar(index: number){
            const responseT = await this.$axios.get(`/tareas/${index}`)
            const tar = responseT.data.data
            tar.activo = 1
            const response = await this.$axios.put(`/tareas/${index}`, tar)
            location.reload();
        },
        async desactivar(index: number){
            const responseT = await this.$axios.get(`/tareas/${index}`)
            const tar = responseT.data.data
            tar.activo = 0
            const response = await this.$axios.put(`/tareas/${index}`, tar)
            location.reload();
        },
        entregaTarea(index: number) {
            const idTar = index.toString()
            const clave = "Anitalabalatina"
            const idCifrado = CryptoJS.AES.encrypt(idTar, clave).toString();
            localStorage.setItem("Tarea", idCifrado)
            this.$router.push("/Tareas/Entrega")
        },
        verItem(item) {
            localStorage.setItem("ver", "true")
            this.$router.push(`/Tareas/${item.id}`)
        },
        cancelar() {
            this.$router.push('/proyectos')
        }
    }
}

</script>