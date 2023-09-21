<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
    <v-container fluid class="text-center">
        <v-btn rounded v-if="seleccionado" v-text="'Seleccionar otro proyecto'" color="primary" @click="sel()" />
        <v-btn rounded v-if="seleccionado" v-text="'Crear una tarea'" color="primary" @click="selProTarea(seleccionado)" />
        <!--<SelectDialog v-if="usuario.rol === 'maestro' || usuario.rol === 'administrador'" :proyectos="proyectos" />--->
        <br>

        <p v-if="(usuario.rol === 'maestro' || usuario.rol === 'administrador') && !seleccionado && proyectos.length !== 0"
            style="font-size: larger ;">
            Selecciona uno de tus proyectos para mostrarte las tareas</p>

        <p v-if="(usuario.rol === 'maestro' || usuario.rol === 'administrador') && !seleccionado && proyectos.length === 0"
            style="font-size: larger;">No tienes ningun proyecto al cual se le puedan asignar o ver tareas para tareas</p>

        <br>
        <v-form style=" padding: 20px; background-color: #e1fffd; box-shadow: 0 0 1px black; border-radius: 2%;">
            <v-row v-if="!seleccionado && usuario.rol !== 'alumno'">
                <v-col v-for="proyecto in proyectos" :key="proyecto.id" cols="12" sm="6" md="4" lg="3">
                    <v-card
                        style="margin-top: 0px; padding: 20px; background-color: whitesmoke; box-shadow: 0 0 5px black; border-radius: 2%;">
                        <div style="border-color: #64B5F6; border-width: 3px; border-style: solid;">
                            <h3>Proyecto: {{ proyecto.nombre }}</h3>
                        </div>
                        <div>
                            <v-btn v-text="'Ver tareas'" color="blue" text small @click="selProyecto(proyecto)" />
                        </div>
                    </v-card>
                </v-col>
            </v-row>
            <v-card-title v-if="seleccionado" style="font-size: x-large;">
                <b>Tareas del proyecto: {{ seleccionado.nombre }}</b>
            </v-card-title>
            <v-card outlined v-if="seleccionado" class="custom-v-card">
                <v-card-title>
                    <b>Todas las tareas que tienes</b>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" label="Buscar tarea" single-line hide-details></v-text-field>
                </v-card-title>
                <v-data-table :items="tareas" :headers="headers" class="custom-data-table" :search="search"
                    :header-props="headerProps"
                    :footer-props="{ itemsPerPageText: 'Tareas por página', pageText: '{0} - {1} de {2}' }">
                    <template v-slot:item.activo="item, index">
                        <span>
                            <v-chip :color="getColor(item.item.activo)" style="color: white">
                                {{ item.item.activo }}
                            </v-chip>
                        </span>
                    </template>
                    <template v-slot:item.actions="{ item, index }">
                        <v-menu offset-y>
                            <template #activator="{ on }">
                                <v-btn color="#64B5F6" text small v-on="on">
                                    <v-icon>
                                        mdi-format-list-bulleted-square
                                    </v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item>
                                    <v-btn color="green" text small @click="verItem(item)">
                                        <v-icon>
                                            mdi-clipboard-text
                                        </v-icon>
                                        Ver
                                    </v-btn>
                                </v-list-item>
                                <v-list-item>
                                    <v-btn color="blue" text small @click="editItem(item)">
                                        <v-icon>
                                            mdi-border-color
                                        </v-icon>
                                        Editar
                                    </v-btn>
                                </v-list-item>
                                <v-list-item v-if="item.activo === 'Oculta'">
                                    <v-btn color="green" text small @click="state(item)">
                                        <v-icon>
                                            mdi-lock-open
                                        </v-icon>
                                        Activar
                                    </v-btn>
                                </v-list-item>
                                <v-list-item v-else>
                                    <v-btn color="red" text small @click="state(item)">
                                        <v-icon>
                                            mdi-lock
                                        </v-icon>
                                        Desactivar
                                    </v-btn>
                                </v-list-item>
                                <v-list-item>
                                    <DeleteDialog :description="`¿Está seguro de querer eliminar la tarea ${item.nombre}
                                de manera permanente? esta acción no se puede deshacer`" :index="index"
                                        :item="item.codigo" :itemUrl="`/Tareas/${item.id}`" />
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </template>
                    <template v-slot:no-results>
                        <v-alert :value="true" color="error">
                            No se encontraron resultados de "{{ search }}".
                        </v-alert>
                    </template>
                </v-data-table>
            </v-card>
            <br>
            <v-card outlined v-if="seleccionado" class="custom-v-card">
                <v-card-title>
                    <b>Tareas pendientes de revisar</b>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search2" label="Buscar tarea" single-line hide-details></v-text-field>
                </v-card-title>
                <v-data-table :items="tareasPen" :headers="headers" class="custom-data-table" :search="search2"
                    :header-props="headerProps"
                    :footer-props="{ itemsPerPageText: 'Tareas por página', pageText: '{0} - {1} de {2}' }">
                    <template v-slot:item.activo="item, index">
                        <span>
                            <v-chip class="white--text" style="background-color: orange;">
                                Pendiente de revisar
                            </v-chip>
                        </span>
                    </template>
                    <template v-slot:item.actions="{ item, index }">
                        <v-menu offset-y>
                            <template #activator="{ on }">
                                <v-btn color="#64B5F6" text small v-on="on">
                                    <v-icon>
                                        mdi-format-list-bulleted-square
                                    </v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item>
                                    <v-btn color="green" text small @click="verItem(item)">
                                        <v-icon>
                                            mdi-clipboard-text
                                        </v-icon>
                                        Ver
                                    </v-btn>
                                </v-list-item>
                                <v-list-item>
                                    <v-btn color="blue" text small @click="editItem(item)">
                                        <v-icon>
                                            mdi-border-color
                                        </v-icon>
                                        Editar
                                    </v-btn>
                                </v-list-item>
                                <v-list-item>
                                    <DeleteDialog :description="`¿Está seguro de querer eliminar la tarea ${item.nombre}
                                de manera permanente? esta acción no se puede deshacer`" :index="index"
                                        :item="item.codigo" :itemUrl="`/Tareas/${item.id}`" />
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </template>
                    <template v-slot:no-results>
                        <v-alert :value="true" color="error">
                            No se encontraron resultados de "{{ search2 }}".
                        </v-alert>
                    </template>
                </v-data-table>
            </v-card>

            <v-card outlined v-if="usuario.rol === 'alumno'" class="custom-v-card">
                <v-card-title>
                    <b>Todas las tareas que tienes</b>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search3" label="Buscar tarea" single-line hide-details></v-text-field>
                </v-card-title>
                <v-data-table :items="tareas" :headers="headers" class="custom-data-table" :search="search3"
                    :header-props="headerProps"
                    :footer-props="{ itemsPerPageText: 'Tareas por página', pageText: '{0} - {1} de {2}' }">
                    <template v-slot:item.activo="item, index">
                        <span>
                            <v-chip v-if="getColorF(item.item) === 'green'" :color="getColorF(item.item)" style="color: white">
                                {{ item.item.activo}}
                            </v-chip>
                            <v-chip v-else color="red" style="color: white">
                                Fecha alcanzada
                            </v-chip>
                        </span>
                    </template>
                    <template v-slot:item.actions="{ item, index }">
                        <v-btn color="blue" text small @click="entregaTarea(item.id)">
                            <v-icon>
                                mdi-clipboard-text
                            </v-icon>
                            Ver tarea
                        </v-btn>
                    </template>
                    <template v-slot:no-results>
                        <v-alert :value="true" color="error">
                            No se encontraron resultados de "{{ search3 }}".
                        </v-alert>
                    </template>
                </v-data-table>
            </v-card>
            <br>
            <v-card outlined v-if="usuario.rol === 'alumno'" class="custom-v-card">
                <v-card-title>
                    <b>Tareas pendientes de entregar</b>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search4" label="Buscar tarea" single-line hide-details></v-text-field>
                </v-card-title>
                <v-data-table :items="tareasPen" :headers="headers" class="custom-data-table" :search="search4"
                :header-props="headerProps" :footer-props="{ itemsPerPageText: 'Tareas por página', pageText: '{0} - {1} de {2}' }">
                    <template v-slot:item.activo="item, index">
                        <span>
                            <v-chip class="white--text" style="background-color: rgb(0, 122, 210);">
                                En fecha de entrega
                            </v-chip>
                        </span>
                    </template>
                    <template v-slot:item.actions="{ item, index }">
                        <v-btn color="blue" text small @click="entregaTarea(item.id)">
                            <v-icon>
                                mdi-clipboard-text
                            </v-icon>
                            Ver tarea
                        </v-btn>
                    </template>
                    <template v-slot:no-results>
                        <v-alert :value="true" color="error">
                            No se encontraron resultados de "{{ search4 }}".
                        </v-alert>
                    </template>
                </v-data-table>
            </v-card>
            <br>
            <v-card outlined v-if="usuario.rol === 'alumno'" class="custom-v-card">
                <v-card-title>
                    Tareas entregadas
                </v-card-title>
                <v-data-table :items="tareasEnt" :headers="headers" class="custom-data-table" :header-props="headerProps"
                    :footer-props="{ itemsPerPageText: 'Tareas por página', pageText: '{0} - {1} de {2}' }">
                    <template v-slot:item.activo="item, index">
                        <span>
                            <v-chip class="white--text" style="background-color: rgb(0, 160, 0);">
                                Entregada
                            </v-chip>
                        </span>
                    </template>
                    <template v-slot:item.actions="{ item, index }">
                        <v-btn color="blue" text small @click="entregaTarea(item.id)">
                            <v-icon>
                                mdi-clipboard-text
                            </v-icon>
                            Ver tarea
                        </v-btn>
                    </template>
                </v-data-table>
            </v-card>
        </v-form>
    </v-container>
</template>
<script lang="ts">

// @ts-nocheck
import { clave } from '@/plugins/globals';
const CryptoJS = require("crypto-js");

export default {
    name: 'Tareas',

    middleware: 'auth',

    data: () => ({
        date: "",
        usuario: "",
        tareas: [],
        tareasPen: [],
        proyectos: [],
        tareasEnt: [],
        search: '',
        search2: '',
        search3: '',
        search4: '',
        entreg: '',
        seleccionado: null,
        pro: "",
        headerProps: {
            sortByText: "Ordenar por"
        },
        headers: [
            { text: 'Nombre de la tarea', value: 'nombre' },
            { text: 'Fecha de entrega', value: 'fecha_limite' },
            { text: 'Hora de entrega', value: 'hora_limite' },
            { text: 'Estado', value: 'activo' },
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
            if (id) {
                const bytes = CryptoJS.AES.decrypt(id, clave);
                this.pro = bytes.toString(CryptoJS.enc.Utf8);
            } else {
                this.pro = null
            }

            if (this.usuario.rol === "alumno") {
                const resusu = await this.$axios.get(`/Alumnos/${this.usuario.codigo}`)
                const respro = await this.$axios.get(`/Proyectos/${resusu.data.data.proyecto_id}`)
                this.proyectos = this.proyectos.concat(respro.data.data)
                const res = await this.$axios.get(`/Tareas/Proyecto/${this.proyectos[0].id}`);
                this.tareas = this.tareas.concat(res.data.data)
                this.tareas = this.tareas.map(tarea => {
                    if (tarea.activo === 1) {
                        tarea.activo = 'Activa';
                    } else if (tarea.activo === 0) {
                        tarea.activo = 'Oculta';
                    }
                    return tarea;
                });
            } else {
                const respro = await this.$axios.get(`/Proyectos/Usuario/${this.usuario.codigo}`);
                this.proyectos = respro.data.data.filter(proyecto => {
                    // Obtiene el último estado del arreglo statuses
                    const ultimoEstado = proyecto.statuses[proyecto.statuses.length - 1];
                    // Verifica si el último estado es "En espera" o "Terminado" y excluye el proyecto si es cierto
                    return !(ultimoEstado && (ultimoEstado.Estado === "En espera" || ultimoEstado.Estado === "Terminado"));
                });
            }

            if (this.pro) {
                try {
                    const respro = await this.$axios.get(`/Proyectos/${this.pro}`)
                    const res = await this.$axios.get(`/Tareas/Proyecto/${this.pro}`);
                    this.tareas = res.data.data;
                    this.tareas = this.tareas.map(tarea => {
                        if (tarea.activo === 1) {
                            tarea.activo = 'Activa';
                        } else if (tarea.activo === 0) {
                            tarea.activo = 'Oculta';
                        }
                        return tarea;
                    });
                    const tar = this.tareas.filter(tarea => tarea.activo === 'Activa')
                    this.tareasPen = tar.filter((tarea) => {
                        const dateEntrega = `${tarea.fecha_limite} ${tarea.hora_limite}`;
                        this.entrega = new Date(dateEntrega)
                        return this.entrega < new Date(this.date);
                    });
                    this.seleccionado = respro.data.data

                } catch { }

            } else {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                for (const proyecto of this.proyectos) {
                    const responseTareas = await this.$axios.get(`/Tareas/Proyecto/${this.pro}`);
                    this.tareas = this.tareas.concat(responseTareas.data.data);
                    this.tareas = this.tareas.map(tarea => {
                        if (tarea.activo === 1) {
                            tarea.activo = 'Activa';
                        } else if (tarea.activo === 0) {
                            tarea.activo = 'Oculta';
                        }
                        return tarea;
                    });
                }
            }


            if (this.usuario.rol === "alumno") {
                this.tareas = this.tareas.filter((tarea) => tarea.activo === 'Activa');
                this.tareasPen = this.tareas.filter((tarea) => {
                    const dateEntrega = `${tarea.fecha_limite} ${tarea.hora_limite}`;
                    this.entrega = new Date(dateEntrega)
                    return this.entrega > new Date(this.date) && tarea.entregada !== 1;
                });
                this.tareasEnt = this.tareas.filter((tarea) => tarea.entregada === 1);
            }
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        getColor(estado) {
            if (estado === 'Activa') return 'green'
            else return 'red'
        },
        getColorF(item) {
            const fecha = `${item.fecha_limite} ${item.hora_limite}`;
            const date = new Date(fecha)
            if (date > new Date(this.date)){
                return 'green'
            }
            else return 'red'
        },
        async selProyecto(proyecto) {
            this.seleccionado = proyecto
            const id = proyecto.id.toString()
            const idCifrado = CryptoJS.AES.encrypt(id, clave).toString();
            localStorage.setItem("ProId", idCifrado)
            const res = await this.$axios.get(`/Tareas/Proyecto/${proyecto.id}`);
            this.tareas = res.data.data;
            this.tareas = this.tareas.map(tarea => {
                if (tarea.activo === 1) {
                    tarea.activo = 'Activa';
                } else if (tarea.activo === 0) {
                    tarea.activo = 'Oculta';
                }
                return tarea;
            });
            const tar = this.tareas.filter(tarea => tarea.activo === 'Activa')
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
            const idCifrado = CryptoJS.AES.encrypt(id.toString(), clave).toString();
            localStorage.setItem("Tarea", idCifrado)
            this.$router.push("Tareas/Entrega")
        },

        selProTarea(proyecto) {
            const id = proyecto.id.toString()
            const idCifrado = CryptoJS.AES.encrypt(id, clave).toString();
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
            if (item.activo === 'Activa') {
                const tarea = { activo: 0 }
                try {
                    await this.$axios.put(`/Tareas/${item.id}`, tarea)
                    this.$nuxt.$emit('show-snackbar', 'green', 'Se a activado la tarea')
                } catch (error) {
                    this.$nuxt.$emit('show-snackbar', 'red', error.message)
                }
            } else {
                const tarea = { activo: 1 }
                try {
                    await this.$axios.put(`/Tareas/${item.id}`, tarea)
                    this.$nuxt.$emit('show-snackbar', 'green', 'Se a desactivado la tarea')
                } catch (error) {
                    $emit('show-snackbar', 'red', error.message)
                }
            }
            location.reload()
        },

        sel() {
            this.seleccionado = !this.seleccionado
        },
    }
}
</script>

<style>
.custom-v-card {
    margin-top: 0px;
    padding: 20px;
    background-color: whitesmoke;
    box-shadow: 0 0 20px black;
}

.custom-data-table {
    border-style: solid;
    border-width: 2px;
    border-color: #ace7ff;
}

/* Estiliza los encabezados de la tabla */
.custom-data-table .v-data-table-header th {
    background-color: #ace7ff;
    /* Color de fondo más oscuro para los encabezados */
    color: white;
    /* Color del texto en los encabezados */
}

/* Estiliza las filas alternas */
.custom-data-table tbody tr:nth-of-type(odd) {
    background-color: #fff;
    /* Fondo gris claro para filas impares */
}

.custom-data-table tbody tr:nth-of-type(even) {
    background-color: #e1fffd;
    /* Fondo blanco para filas pares */
}

.custom-data-table .v-data-footer {
    background-color: #d3d6d7;
}


.custom-data-table .v-data-table-header {
    color: white;
}
</style>