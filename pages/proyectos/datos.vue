<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/v-slot-style -->
<!-- eslint-disable vue/require-v-for-key -->
<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-row>
                <v-spacer />
                <v-btn v-if="roles.rol == 'maestro' || roles.rol == 'administrador'" @click="cancelar()" color="red">
                    Regresar
                </v-btn>
                <v-btn v-if="roles.rol == 'alumno' && estado == 'Terminado'" @click="contPro()" color="blue">
                    Constancia
                </v-btn>
                <v-menu offset-y v-if="roles.rol == 'maestro' && estado == 'Activo' || roles.rol == 'administrador'">
                    <template v-slot:activator="{ on }">
                        <v-btn color="blue" v-on="on" text small> Opciones </v-btn>
                    </template>
                    <v-list>
                        <v-list-item v-if="estado == 'Activo'">
                            <v-list-item-action>
                                <v-btn v-text="'Terminar Proyecto'" color="blue" text small @click="TerProg()" />
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item v-if="estado == 'Terminado'">
                            <v-list-item-action>
                                <v-btn v-text="'Activar Proyecto'" color="blue" text small @click="ActProg()" />
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-row>
            <br>
            <v-card>
                <v-card-title>
                    {{ proyecto.nombre }}
                </v-card-title>
                <v-card-text>
                    Maestro encargado: {{ maestro }}
                    <v-spacer />
                    Carrera: {{ carrera }}
                </v-card-text>
                <v-card-text>
                    ALumnos Participantes:
                    <v-card-text v-if="participantes.length == 0"> Ninguno </v-card-text>
                    <br>
                    <li v-for="item in participantes">
                        {{ item.nombre }}
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
                    {{ proyecto.objetivos }}
                </v-card-text>
                <v-card-title>
                    Fecha de Entrega
                </v-card-title>
                <v-card-text>
                    {{ proyecto.fechafinal }}
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
                        <v-btn v-if="item.activo == 0" v-text="'Activar'" color="green" text small
                            @click="activar(item.id)" />
                        <v-btn v-if="item.activo == 1" v-text="'Desactivar'" color="red" text small
                            @click="desactivar(item.id)" />
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
            <br>
            <v-row>
                <v-spacer />
                <v-btn v-if="roles.rol == 'maestro' || roles.rol == 'administrador' && estatus === 0"
                    @click="CambiarEstatus()" color="green">
                    Agregar un estado al proyecto
                </v-btn>
            </v-row>
            <br>
            <v-card v-if="estatus === 1">
                <v-card-title>
                    Agregar un Estado al proyecto
                </v-card-title>
                <v-card-text>
                    <v-combobox v-model="est.estado" label="Estado" :items="estados"
                        :rules="[$validations.notEmpty]"></v-combobox>
                    <v-text-field v-model="estado.nota" label="Nota"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="red" @click="CambiarEstatus()">
                        Cancelar
                    </v-btn>
                    <v-btn @click="agregarStatus()" color="green">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
            <br>
            <v-card>
                <v-card-title>
                    Registro Histórico
                </v-card-title>
                <v-data-table :items="registros" :headers="headersH">
                    <!-- Aquí puedes personalizar la visualización de las celdas si es necesario -->
                </v-data-table>
            </v-card>
        </v-form>
    </v-container>
</template>

<script lang="ts">

// @ts-nocheck
import {jsPDF} from 'jspdf';
const CryptoJS = require("crypto-js");


export default {
    name: 'ProyectosDatos',
    middleware: 'auth',
    data: () => ({
        estatus: 0,
        roles: {},
        proyecto: {},
        stat: {
            id: "2",
            Estado: "Terminado",
        },
        estado: "",
        maestro: "",
        id: "",
        carrera: "",
        participantes: [],
        tareas: [],
        tareas2: [],
        registros: [],
        estados: [],
        headers: [
            { text: 'Nombre', value: 'nombre' },
            { text: 'Fecha de entrega', value: 'fecha_limite' },
            { text: 'Hora de entrega', value: 'hora_limite' },
            { text: 'Acciones', value: 'actions' },
        ],
        headersH: [
            { text: 'Fecha', value: 'Fecha' },
            { text: 'Estado', value: 'Estado' },
            { text: 'Nota', value: 'Nota' },
        ],
        est: {
            estado: "",
            nota: "",
            status_id: 0
        }
    }),

    async beforeMount() {
        this.$store.commit('setTitle', 'Proyectos')
        const clave = "Anitalabalatina"
        const idCifrado = localStorage.getItem("proId")
        const bytes = CryptoJS.AES.decrypt(idCifrado, clave);
        const idDescifrado = bytes.toString(CryptoJS.enc.Utf8);
        this.id = idDescifrado

        try {
            const response = await this.$axios.get(`/proyectos/${this.id}`);
            this.proyecto = response.data.data
            const Estados = this.proyecto.statuses.map(status => ({
                Fecha: new Date(status.statusProyecto.createdAt).toISOString().split('T')[0],
                Estado: status.Estado,
                Nota: status.statusProyecto.nota,
            }));
            this.registros = Estados;

            const responseS = await this.$axios.get(`/Status`);
            responseS.data.data.map(status => (
                this.estados = this.estados.concat(status.Estado)
            ));
            this.carrera = this.proyecto.Carrera.nombre
            this.maestro = this.proyecto.encargado.nombre
            this.participantes = this.proyecto.Alumnos
            this.estado = this.proyecto.statuses[0].Estado
            const responseT = await this.$axios.get(`/tareas/proyecto/${this.id}`);
            this.tareas = responseT.data.data
            this.tareas2 = this.tareas.filter(item => item.activo === 1)
            const responseR = await this.$axios.get('/login');
            this.roles = responseR.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        async activar(index: number) {
            const response = await this.$axios.get(`/tareas/${index}`)
            const tar = response.data.data
            tar.activo = 1
            await this.$axios.put(`/tareas/${index}`, tar)
            location.reload();
        },
        async desactivar(index: number) {
            const response = await this.$axios.get(`/tareas/${index}`)
            const tar = response.data.data
            tar.activo = 0
            await this.$axios.put(`/tareas/${index}`, tar)
            location.reload();
        },
        entregaTarea(index: number) {
            const idTar = index.toString()
            const clave = "Anitalabalatina"
            const idCifrado = CryptoJS.AES.encrypt(idTar, clave).toString();
            localStorage.setItem("Tarea", idCifrado)
            this.$router.push("/Tareas/Entrega")
        },
        async contPro() {
            const response = await this.$axios.get(`/proyectos/${this.id}`)
            const pro = response.data.data
            // eslint-disable-next-line new-cap
            const doc = new jsPDF();
            const res2 = await this.$axios.get(`/alumnos/${this.roles.codigo}`)
            const nombre = res2.data.data.nombre
            doc.text(`El certificado en cuestion es otorgado a ${nombre} por el proyecto ${pro.nombre} realizado
            bajo la supervicion de ${pro.encargado.nombre}, de la carrera de ${pro.Carrera.nombre}`, 10, 10)
            doc.save('Certificado.pdf')
        },
        verItem(item) {
            localStorage.setItem("ver", "true")
            this.$router.push(`/Tareas/${item.id}`)
        },
        async TerProg() {
            const terminar = await this.$axios.get(`/status`)
            const terid = terminar.data.data.filter(item => item.id === 2)
            if(terid.length == 0){
                console.log(this.stat)
                const estado = await this.$axios.post('/status', this.stat)
            }
            this.proyecto.estado = this.stat.Estado
            await this.$axios.put(`/proyectos/${this.proyecto.id}`, this.proyecto)
            location.reload();
        },
        async ActProg() {
            this.proyecto.estado = "Activo"
            //await this.$axios.put(`/proyectos/${this.proyecto.id}`, this.proyecto)
        },
        cancelar() {
            this.$router.push('/proyectos')
        },
        async agregarStatus() {
            if (this.estado.estado === "") {
                return this.$nuxt.$emit('show-snackbar', 'orange', 'Completa todos los espación obligatorios antes de continuar')
            }
            try {
                const res = await this.$axios.get(`/Status/Estado/${this.est.estado}`)
                this.est.status_id = res.data.data.id
                await this.$axios.put(`/proyectos/${this.proyecto.id}`, this.est)
                this.$nuxt.$emit('show-snackbar', 'green', 'Se agregó el estado correctamente')
                location.reload()
                
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.response.data.message)
            }

        },
        CambiarEstatus() {
            this.estatus = this.estatus === 0 ? 1 : 0;
        }
    }
}

</script>