<template>
    <v-container fluid class="text-center">
        <v-spacer />
        <v-menu v-if="usuario.rol === 'maestro' || usuario.rol === 'administrador'" offset-y>
            <template #activator="{ on }">
                <v-btn v-text="'Crear una tarea'" color="primary" v-on="on" />
            </template>
            <v-list>
                <v-list-item v-for="(proyecto, index) in proyectos" :key="index">
                    <v-list-item @click="selProTarea(proyecto)">{{ proyecto.nombre }}</v-list-item>
                </v-list-item>
            </v-list>
        </v-menu>
        <!--<SelectDialog v-if="usuario.rol === 'maestro' || usuario.rol === 'administrador'" :proyectos="proyectos" />--->
        <br>
        <p v-if="usuario.rol === 'maestro' || usuario.rol === 'administrador'" style="font-size: larger ;">Selecciona uno de
            tus proyectos para mostrarte las tareas</p>
        <v-menu v-if="usuario.rol === 'maestro' || usuario.rol === 'administrador'" offset-y>
            <template #activator="{ on }">
                <v-btn v-text="'Seleccionar Proyecto'" color="primary" v-on="on" />
            </template>
            <v-list>
                <v-list-item v-for="(proyecto, index) in proyectos" :key="index">
                    <v-list-item @click="selProyecto(proyecto)">{{ proyecto.nombre }}</v-list-item>
                </v-list-item>
            </v-list>
        </v-menu>
        <br>
        <v-card-title v-if="seleccionado" style="font-size: x-large;">
            Tareas del proyecto: {{ seleccionado.nombre }}
        </v-card-title>
        <v-card v-if="seleccionado">
            <v-card-title>
                Todas las tareas que tienes
            </v-card-title>
            <v-data-table :items="tareas" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-menu offset-y>
                        <template #activator="{ on }">
                            <v-btn v-text="'Acciones'" color="orange" text small v-on="on" />
                        </template>
                        <v-list>
                            <v-list-item>
                                <v-btn v-text="'Ver'" color="green" text small @click="verItem(item)" />
                            </v-list-item>
                            <v-list-item>
                                <v-btn v-text="'Editar'" color="blue" text small @click="editItem(item)" />
                            </v-list-item>
                            <v-list-item v-if="item.activo === 0">
                                <v-btn v-text="'Activar'" color="green" text small @click="state(item)" />
                            </v-list-item>
                            <v-list-item v-else>
                                <v-btn v-text="'Desactivar'" color="red" text small @click="state(item)" />
                            </v-list-item>
                            <v-list-item>
                                <DeleteDialog :description="`¿Está seguro de querer eliminar la tarea ${item.nombre}
                                de manera permanente? esta acción no se puede deshacer`" :index="index"
                                    :item="item.codigo" :itemUrl="`/Tareas/${item.id}`" />
                            </v-list-item>
                        </v-list>
                    </v-menu>
                    <!--
                        <v-btn v-text="'Editar'" color="blue" text small :to="`/Tareas/${item.id}`" />
                    <DeleteDialog :description="`¿Está seguro de querer eliminar la tarea '${item.nombre}'?`"
                        :itemUrl="`/Tareas/${item.id}`" :index="index" list="" item="" />
                    -->
                </template>
            </v-data-table>
        </v-card>
        <br>
        <br>
        <p v-if="usuario.rol === 'maestro' || usuario.rol === 'administrador'" style="font-size: large ;">A continuación se
            muestran solo las tareas con estado Activo igual que 1 y que esten
            pendientes de revisar</p>
        <v-card v-if="seleccionado">
            <v-card-title>
                Tareas pendientes de revisar
            </v-card-title>
            <v-data-table :items="tareasPen" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-menu offset-y>
                        <template #activator="{ on }">
                            <v-btn v-text="'Acciones'" color="orange" text small v-on="on" />
                        </template>
                        <v-list>
                            <v-list-item>
                                <v-btn v-text="'Ver'" color="green" text small @click="verItem(item)" />
                            </v-list-item>
                            <v-list-item>
                                <v-btn v-text="'Editar'" color="blue" text small @click="editItem(item)" />
                            </v-list-item>
                            <v-list-item>
                                <DeleteDialog :description="`¿Está seguro de querer eliminar la tarea ${item.nombre}
                                de manera permanente? esta acción no se puede deshacer`" :index="index"
                                    :item="item.codigo" :itemUrl="`/Tareas/${item.id}`" />
                            </v-list-item>
                        </v-list>
                    </v-menu>
                    <!--
                        <v-btn v-text="'Editar'" color="blue" text small :to="`/Tareas/${item.id}`" />
                    <DeleteDialog :description="`¿Está seguro de querer eliminar la tarea '${item.nombre}'?`"
                        :itemUrl="`/Tareas/${item.id}`" :index="index" list="" item="" />
                    -->
                </template>
            </v-data-table>
        </v-card>

        <v-card v-if="usuario.rol === 'alumno'">
            <v-card-title>
                Todas las tareas que tienes
            </v-card-title>
            <v-data-table :items="tareas" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-btn v-text="'Ver tarea'" color="blue" text small @click="entregaTarea(item.id)" />
                    <!--
                        <v-btn v-text="'Editar'" color="blue" text small :to="`/Tareas/${item.id}`" />
                    <DeleteDialog :description="`¿Está seguro de querer eliminar la tarea '${item.nombre}'?`"
                        :itemUrl="`/Tareas/${item.id}`" :index="index" list="" item="" />
                    -->
                </template>
            </v-data-table>
        </v-card>
        <br>
        <v-card v-if="usuario.rol === 'alumno'">
            <v-card-title>
                Tareas pendientes de entregar
            </v-card-title>
            <v-data-table :items="tareasPen" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-btn v-text="'Ver tarea'" color="blue" text small @click="entregaTarea(item.id)" />
                </template>
            </v-data-table>
        </v-card>
        <br>
        <v-card v-if="usuario.rol === 'alumno'">
            <v-card-title>
                Tareas entregadas
            </v-card-title>
            <v-data-table :items="tareasEnt" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-btn v-text="'ver tarea'" color="blue" text small @click="entregaTarea(item.id)" />
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script lang="ts">

const CryptoJS = require("crypto-js");

export default {
    name: 'Tareas',

    middleware: 'auth',

    data: () => ({
        clave: "Anitalabalatina",
        date: "",
        usuario: "",
        tareas: [],
        tareasPen: [],
        proyectos: [],
        tareasEnt: [],
        seleccionado: null,
        pro: "",
        headers: [
            { text: 'Nombre de la tarea', value: 'nombre' },
            { text: 'Fecha de entrega', value: 'fecha_limite' },
            { text: 'Hora de entrega', value: 'hora_limite' },
            { text: 'Activa', value: 'activo' },
            { text: 'Acciones', value: 'actions' },
        ]
    }),
    async beforeMount() {
        this.$nuxt.$on('remove-from-list', this.deleteElement)
        this.$store.commit('setTitle', 'Tareas')
        try {
            const res = await this.$axios.get('/Login')
            this.usuario = res.data

            const hoy = new Date();
            const año = hoy.getFullYear();
            const mes = String(hoy.getMonth() + 1).padStart(2, '0');
            const dia = String(hoy.getDate()).padStart(2, '0');

            const horas = String(hoy.getHours()).padStart(2, '0');
            const minutos = String(hoy.getMinutes()).padStart(2, '0');
            const segundos = String(hoy.getSeconds()).padStart(2, '0');

            const fecha = `${año}-${mes}-${dia}`;
            const hora = `${horas}:${minutos}:${segundos}`;
            this.date = `${fecha} ${hora}`

            const id = localStorage.getItem("ProId")
            if(id){
                const bytes = CryptoJS.AES.decrypt(id, this.clave);
                this.pro = bytes.toString(CryptoJS.enc.Utf8);
            }else{
                this.pro = null
            }
            

            if (this.usuario.rol === "alumno") {
                const resusu = await this.$axios.get(`/Alumnos/${this.usuario.codigo}`)
                const respro = await this.$axios.get(`/Proyectos/${resusu.data.data.proyecto_id}`)
                this.proyectos = this.proyectos.concat(respro.data.data)
                const res = await this.$axios.get(`/Tareas/Proyecto/${this.proyectos[0].id}`);
                this.tareas = this.tareas.concat(res.data.data)
            } else {
                const respro = await this.$axios.get(`/Proyectos/Usuario/${this.usuario.codigo}`)
                this.proyectos = respro.data.data
            }

            if (this.pro) {
                try {
                    const respro = await this.$axios.get(`/Proyectos/${this.pro}`)
                    const res = await this.$axios.get(`/Tareas/Proyecto/${this.pro}`);
                    this.tareas = res.data.data;
                    const tar = this.tareas.filter(tarea => tarea.activo === 1)
                    this.tareasPen = tar.filter((tarea) => {
                        const dateEntrega = `${tarea.fecha_limite} ${tarea.hora_limite}`;
                        const entrega = new Date(dateEntrega)
                        return entrega < new Date(this.date);
                    });
                    this.seleccionado = respro.data.data

                } catch { }

            } else {
                for (const proyecto of this.proyectos) {
                    const responseTareas = await this.$axios.get(`/Tareas/Proyecto/${this.pro}`);
                    this.tareas = this.tareas.concat(responseTareas.data.data);
                }
            }


            if (this.usuario.rol === "alumno") {
                this.tareas = this.tareas.filter((tarea) => tarea.activo === 1);
                this.tareasPen = this.tareas.filter((tarea) => {
                    const dateEntrega = `${tarea.fecha_limite} ${tarea.hora_limite}`;
                    const entrega = new Date(dateEntrega)
                    return entrega > new Date(this.date) && tarea.entregada !== 1;
                });
                this.tareasEnt = this.tareas.filter((tarea) => tarea.entregada === 1);
            }
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }

    },

    methods: {
        async selProyecto(proyecto) {
            this.seleccionado = proyecto
            const id = proyecto.id.toString()
            const idCifrado = CryptoJS.AES.encrypt(id, this.clave).toString();
            localStorage.setItem("ProId", idCifrado)
            const res = await this.$axios.get(`/Tareas/Proyecto/${proyecto.id}`);
            this.tareas = res.data.data;

            const tar = this.tareas.filter(tarea => tarea.activo === 1)
            this.tareasPen = tar.filter((tarea) => {
                const dateEntrega = `${tarea.fecha_limite} ${tarea.hora_limite}`;
                const entrega = new Date(dateEntrega)
                return entrega < new Date(this.date);
            });
        },

        deleteElement(index: number) {
            this.tareas.pop(index)
            location.reload()
        },
        entregaTarea(id: number) {
            const idCifrado = CryptoJS.AES.encrypt(id.toString(), this.clave).toString();
            localStorage.setItem("Tarea", idCifrado)
            this.$router.push("Tareas/Entrega")
        },

        async selProTarea(proyecto) {
            const id = proyecto.id.toString()
            const idCifrado = CryptoJS.AES.encrypt(id, this.clave).toString();
            localStorage.setItem("ProId", idCifrado)
            this.$router.push(`/Tareas/Create`)
        },

        editItem(item) {
            localStorage.setItem("ver", "false")
            this.$router.push(`/Tareas/${item.id}`)
        },

        verItem(item) {
            localStorage.setItem("ver", "true")
            this.$router.push(`/Tareas/${item.id}`)
        },

        async state(item) {
            if (item.activo === 0) {
                const tarea = { activo: 1 }
                try {
                    await this.$axios.put(`/Tareas/${item.id}`, tarea)
                    this.$nuxt.$emit('show-snackbar', 'green', 'Se a activado la tarea')
                } catch (error) {
                    this.$nuxt.$emit('show-snackbar', 'red', error.message)
                }
            } else {
                const tarea = { activo: 0 }
                try {
                    await this.$axios.put(`/Tareas/${item.id}`, tarea)
                    this.$nuxt.$emit('show-snackbar', 'green', 'Se a desactivado la tarea')
                } catch (error) {
                    this.$nuxt.$emit('show-snackbar', 'red', error.message)
                }
            }
            location.reload()
        },
    }
}
</script>