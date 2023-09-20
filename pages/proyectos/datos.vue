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
                <v-btn rounded dark v-if="roles.rol == 'maestro' || roles.rol == 'administrador'" @click="cancelar()" color="red">
                    <v-icon>
                        mdi-arrow-left
                    </v-icon>
                    Regresar
                </v-btn>
                <v-btn dark rounded v-if="roles.rol == 'alumno' && estado == 'Terminado'" @click="contPro()" color="blue">
                    <v-icon>
                        mdi-download
                    </v-icon>
                    Constancia
                </v-btn>
                <v-menu offset-y v-if="roles.rol == 'maestro' && estado == 'Activo' || roles.rol == 'administrador'">
                    <template v-slot:activator="{ on }">
                        <v-btn dark color="blue" v-on="on" text small>
                            <v-icon>
                                mdi-cogs
                            </v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item v-if="estado !== 'Terminado'">
                            <v-list-item-action>
                                <v-btn v-text="'Terminar Proyecto'" color="blue" text small @click="TerProg()" />
                            </v-list-item-action>
                        </v-list-item>
                        <v-list-item v-if="estado === 'En espera'">
                            <v-list-item-action>
                                <v-btn v-text="'Validar proyecto'" color="blue" text small @click="ValPro()" />
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-row>
            <br>
            <v-card outlined style="margin-top: 0px; background-color: #66BB6A; border-width: 1px; border-style: solid; 
                padding: 20px; border-radius: 1%; box-shadow: 0 0 10px black;">
                <v-card-title>
                    {{ proyecto.nombre }}
                </v-card-title>
                <v-card-text>
                    <b>Maestro encargado:</b> {{ maestro }}
                    <v-spacer />
                    <b>Carrera:</b> {{ carrera }}
                </v-card-text>
                <v-card-text>
                    <b>Alumnos Participantes:</b>
                    <v-card-text v-if="participantes.length == 0"> Ninguno </v-card-text>
                    <br>
                    <li v-for="item in participantes">
                        {{ item.nombre }}
                        <br>
                    </li>
                </v-card-text>
            </v-card>
            <br>
            <v-card outlined style="margin-top: 0px; background-color: #66BB6A; border-width: 1px; border-style: solid; 
                padding: 20px; border-radius: 1%; box-shadow: 0 0 10px black;">
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
            <v-card-title v-if="roles.rol == 'maestro' || roles.rol == 'administrador'">
                <b>Tareas</b>
            </v-card-title>
            <v-card outlined v-if="roles.rol == 'maestro' || roles.rol == 'administrador'">
                <v-data-table :items="tareas" :headers="headers" class="rows-green" :header-props="headerProps"
                    :footer-props="{ itemsPerPageText: 'Tareas por página', pageText: '{0} - {1} de {2}' }">
                    <template v-slot:item.actions="{ item, index }">
                        <v-btn dark color="blue" rounded text small @click="verItem(item)">
                            <v-icon small>
                                mdi-clipboard-text
                            </v-icon>
                            Ver tarea
                        </v-btn>
                        <v-btn v-if="item.activo == 0" color="green" text small @click="activar(item.id)">
                            <v-icon dark small>
                                mdi-lock-open
                            </v-icon>
                            Activar
                        </v-btn>
                        <v-btn dark v-if="item.activo == 1" color="red" text small @click="desactivar(item.id)">
                            <v-icon dark small>
                                mdi-lock
                            </v-icon>
                            Desactivar
                        </v-btn>
                    </template>
                </v-data-table>
            </v-card>
            <v-card-title v-if="roles.rol == 'alumno'">
                <b>Tareas</b>
            </v-card-title>
            <v-card outlined v-if="roles.rol == 'alumno'" style="box-shadow: 0 0 10px black; background-color: #66BB6A;">
                <v-data-table :items="tareas2" :headers="headers" class="rows-green" :header-props="headerProps"
                    :footer-props="{ itemsPerPageText: 'Tareas por página', pageText: '{0} - {1} de {2}' }">
                    <template v-slot:item.actions="{ item, index }">
                        <v-btn dark rounded color="blue" @click="entregaTarea(item.id)">
                            <v-icon small>
                                mdi-clipboard-text
                            </v-icon>
                            Ver tarea
                        </v-btn>
                    </template>
                </v-data-table>
            </v-card>
            <br>
            <v-row v-if="estado !== 'En espera'">
                <v-spacer />
                <v-btn dark rounded v-if="roles.rol == 'maestro' || roles.rol == 'administrador' && estatus === 0"
                    @click="CambiarEstatus()" color="green">
                    <v-icon dark>
                        mdi-plus
                    </v-icon>
                    Agregar un estado al proyecto
                </v-btn>
            </v-row>
            <br>
            <v-form v-if="estatus === 1" class="custom-v-form">
                <v-card>
                    <v-card-title>
                        Agregar un estado al proyecto
                    </v-card-title>
                    <v-card-text>
                        <v-combobox v-model="est.estado" outlined label="Estado" :items="estados"
                            :rules="[$validations.notEmpty]"></v-combobox>
                        <v-textarea v-model="est.nota" outlined style="overflow-y: auto; max-block-size: 300px; "
                            label="Nota"></v-textarea>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn dark rounded color="red" @click="CambiarEstatus()">
                            Cancelar
                            <v-icon>
                                mdi-cancel
                            </v-icon>
                        </v-btn>
                        <v-btn dark rounded @click="agregarStatus()" color="green">
                            Guardar
                            <v-icon>
                                mdi-checkbox-marked-circle
                            </v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
            <br>
            <v-card-title v-if="roles.rol == 'maestro' || roles.rol == 'administrador'">
                <b>Registro Histórico</b>
            </v-card-title>
            <v-card outlined v-if="roles.rol == 'maestro' || roles.rol == 'administrador'">
                <v-data-table :items="registros" :headers="headersH" class="rows-green" :header-props="headerProps"
                    :footer-props="{ itemsPerPageText: 'Tareas por página', pageText: '{0} - {1} de {2}' }">
                    <template v-slot:item.actions="{ item, index }">
                        <RemoveState v-if="item.Estado !== 'En espera' && item.Estado !== 'Activo'"
                            :description="`¿Está seguro de querer eliminar el registro del estado '${item.Estado}'?. Esta acción no se puede deshacer`"
                            :id="id" :index="index" :estado="item.Estado" @remove-from-list="deleteElement" />
                    </template>
                </v-data-table>
            </v-card>
        </v-form>
    </v-container>
</template>

<script lang="ts">

// @ts-nocheck
import { jsPDF } from 'jspdf';
import { clave } from '@/plugins/globals';
import { encabezado, piepagina } from '@/plugins/imagesbase64';
import RemoveState from '~/components/RemoveState.vue';
const CryptoJS = require("crypto-js");


export default {
    name: 'ProyectosDatos',
    middleware: 'auth',
    data: () => ({
        estatus: 0,
        roles: {},
        proyecto: {},
        stat: {
            id: "3",
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
        headerProps: {
            sortByText: "Ordenar por"
        },
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
            { text: 'Acciones', value: 'actions' },
        ],
        est: {
            estado: "",
            nota: "",
            status_id: 0
        }
    }),
    async beforeMount() {
        this.$store.commit('setTitle', 'Proyectos');
        this.$nuxt.$on('remove-from-list', this.deleteElement);
        const idCifrado = localStorage.getItem("proId");
        const bytes = CryptoJS.AES.decrypt(idCifrado, clave);
        const idDescifrado = bytes.toString(CryptoJS.enc.Utf8);
        this.id = idDescifrado;
        try {
            const response = await this.$axios.get(`/proyectos/${this.id}`);
            this.proyecto = response.data.data;
            const Estados = this.proyecto.statuses.map(status => ({
                Fecha: new Date(status.statusProyecto.createdAt).toISOString().split('T')[0],
                Estado: status.Estado,
                Nota: status.statusProyecto.nota,
            }));
            this.proyecto.fechafinal = new Date(this.proyecto.fechafinal).toISOString().split('T')[0]
            this.registros = Estados;
            const responseS = await this.$axios.get(`/Status`);
            responseS.data.data.map(status => (this.estados = this.estados.concat(status.Estado)));
            this.estados.splice(0, 1)
            this.estados.splice(0, 1)
            const term = this.estados.splice(0, 1)
            this.estados.push(term)
            this.carrera = this.proyecto.Carrera.nombre;
            this.maestro = this.proyecto.encargado.nombre;
            this.participantes = this.proyecto.Alumnos;
            this.carrera = this.proyecto.Carrera.nombre
            this.maestro = this.proyecto.encargado.nombre
            this.participantes = this.proyecto.Alumnos
            const utl = this.proyecto.statuses.length
            this.estado = this.proyecto.statuses[utl - 1].Estado
            const responseT = await this.$axios.get(`/tareas/proyecto/${this.id}`);
            this.tareas = responseT.data.data;
            this.tareas2 = this.tareas.filter(item => item.activo === 1);
            const responseR = await this.$axios.get('/login');
            this.roles = responseR.data;
        }
        catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message);
        }
    },
    methods: {
        async activar(index: number) {
            const response = await this.$axios.get(`/tareas/${index}`);
            const tar = response.data.data;
            tar.activo = 1;
            await this.$axios.put(`/tareas/${index}`, tar);
            location.reload();
        },
        async desactivar(index: number) {
            const response = await this.$axios.get(`/tareas/${index}`);
            const tar = response.data.data;
            tar.activo = 0;
            await this.$axios.put(`/tareas/${index}`, tar);
            location.reload();
        },
        entregaTarea(index: number) {
            const idTar = index.toString();
            const idCifrado = CryptoJS.AES.encrypt(idTar, clave).toString();
            localStorage.setItem("Tarea", idCifrado);
            this.$router.push("/Tareas/Entrega");
        },
        async contPro() {
            const response = await this.$axios.get(`/proyectos/${this.id}`);
            const pro = response.data.data;
            // eslint-disable-next-line new-cap
            const doc = new jsPDF();
            const img = new Image()
            const img2 = new Image()
            const hoy = new Date();
            const año = hoy.getFullYear();
            const mes = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date())
            const dia = String(hoy.getDate()).padStart(2, '0');
            img.src = encabezado
            img2.src = piepagina
            const res2 = await this.$axios.get(`/alumnos/${this.roles.codigo}`);
            const nombre = res2.data.data.nombre;
            doc.addImage(img, 'PNG', 10, 5, 115, 30)
            doc.setFontSize(14)
            doc.setFont("Courier", "bold")
            doc.text(`A QUIEN CORRESPONDA:`, 25, 45)
            const width = doc.internal.pageSize.getWidth()
            doc.setFontSize(13)
            doc.setFont("Courier", "normal")
            const line1 = `<font face="Courier" size=1 > <p style="width: 335px" align="justify"> El que suscribe <b>Dr. Héctor Huerta Avila</b>, Jefe de Departamento de Ciencias Computacionales e Ingenierías, del Centro Universitario de los Valles, por medio del presente certifica y hace </p> <br>
            <font size=2 > <p style="width: 335px" align="center"> <b>CONSTAR</b> </p> </font><br>
            <p style="width: 335px" align="justify"> Que el alumno de la carrera de ${this.carrera}, <b>${nombre}</b> con código <b>${this.roles.codigo}</b> presentó el proyecto denominado <b>${pro.nombre}</b>, de acuerdo con el resolutivo séptimo del dictamen de creación del Programa Educativo mencionado. </p></font>`
            const container = document.createElement('p');
            container.innerHTML = line1;
            doc.html(container, {
                x: 25,
                y: 50,
                html2canvas: {
                    scale: 0.48,
                    Width: 160,
                },
                callback: function (doc) {
                    doc.save(`Certificado - ${nombre}.pdf`);
                },
            })
            doc.text(`Se extiende la presente a petición del interesado, para los fines legales a que ella convenga.`, 25, 140, { maxWidth: 160, align: "justify" })
            doc.setFontSize(12)
            doc.setFont("Courier", "bold")
            doc.text(`ATENTAMENTE`, width / 2, 160, { align: "center" })
            doc.setFont("Courier", "normal")
            doc.text(`“Piensa y Trabaja”`, width / 2, 164, { align: "center" })
            doc.setFontSize(13)
            doc.setFont("Courier", "bold")
            doc.text(`“${año}, Año del fomento a la formación integral con una`, width / 2, 168, { align: "center" })
            doc.text(`Red de Centros y Sistemas Multitemáticos”`, width / 2, 172, { align: "center" })
            doc.setFontSize(12)
            doc.setFont("Courier", "normal")
            doc.text(`Ameca, Jalisco, ${dia} de ${mes} del ${año}`, width / 2, 176, { align: "center" })
            doc.setFontSize(13)
            doc.setFont("Courier", "bold")
            doc.text(`Dr. Héctor Huerta Avila`, width / 2, 186, { align: "center" })
            doc.setFont("Courier", "normal")
            doc.text(`Jefe de Departamento`, width / 2, 190, { align: "center" })
            doc.addImage(img2, 'PNG', 50, 270, 110, 16, { align: "center" });
        },
        verItem(item) {
            localStorage.setItem("ver", "true");
            this.$router.push(`/Tareas/${item.id}`);
        },
        async TerProg() {
            this.proyecto.estado = 'Terminado'
            //await this.$axios.put(`/proyectos/${this.proyecto.id}`, this.proyecto);
            this.est.status_id = 3;
            this.est.estado = 'Terminado'
            this.est.nota = 'Proyecto finalizado'
            await this.$axios.put(`/proyectos/${this.id}`, this.est);
            location.reload();
        },
        async ValPro() {
            this.proyecto.estado = 'Activo'
            //await this.$axios.put(`/proyectos/${this.proyecto.id}`, this.proyecto);
            this.est.status_id = 2;
            this.est.estado = 'Activo'
            this.est.nota = 'Proyecto validado'
            await this.$axios.put(`/proyectos/${this.id}`, this.est);
            location.reload();
        },
        async ActProg() {
            this.proyecto.estado = "Activo";
            //await this.$axios.put(`/proyectos/${this.proyecto.id}`, this.proyecto)
        },
        cancelar() {
            this.$router.push('/proyectos');
        },
        async agregarStatus() {
            if (this.estado.estado === "") {
                return this.$nuxt.$emit('show-snackbar', 'orange', 'Completa todos los espación obligatorios antes de continuar');
            }
            try {
                const res = await this.$axios.get(`/Status/Estado/${this.est.estado}`);
                this.est.status_id = res.data.data.id;
                await this.$axios.put(`/proyectos/${this.proyecto.id}`, this.est);
                this.$nuxt.$emit('show-snackbar', 'green', 'Se agregó el estado correctamente');
                location.reload();
            }
            catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.response.data.message);
            }
        },
        CambiarEstatus() {
            this.estatus = this.estatus === 0 ? 1 : 0;
            this.est.estado = "";
            this.est.nota = "";
        },
        deleteElement(index: number) {
            this.estados.splice(index, 1);
            location.reload()
        },
    },
    components: { RemoveState }
}

</script>

<style>
.custom-v-form {
    margin-top: 0px;
    padding: 20px;
    background-color: #66BB6A;
    box-shadow: 0 0 20px black;
}

.rows-green .v-data-table-header {
    background-color: #66BB6A;
}

.rows-green {
    border-style: solid;
    border-width: 2px;
    border-color: #66BB6A;
}
</style>