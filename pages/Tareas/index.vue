<template>
    <v-container fluid>
        <v-row>
            <v-spacer />
            <SelectDialog v-if="usuario.rol=== 'maestro' || usuario.rol=== 'administrador'" :proyectos="proyectos"/>
        </v-row>
        <br>
        <v-title style="font-size: x-large;" class="text-center">Todas las tareas</v-title>
        <v-card v-if="usuario.rol!== 'alumno'">
            <v-card-title>
                Todas las tareas que tienes
            </v-card-title>
            <v-data-table :items="tareas" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-btn v-text="'Editar'" color="blue" text small :to="`/Tareas/${item.id}`" />
                    <DeleteDialog :description="`¿Está seguro de querer eliminar la tarea '${item.nombre}'?`"
                        :itemUrl="`/Tareas/${item.id}`" :index="index" list="" item="" />
                </template>
            </v-data-table>
        </v-card>
        <v-card v-else>
            <v-card-title>
                Todas las tareas que tienes
            </v-card-title>
            <v-data-table :items="tareas" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-btn v-text="'ver'" color="blue" text small :to="{ path: `/Tareas/Entrega`,
                    query: { id: item.id } }" />
                </template>
            </v-data-table>
        </v-card>
        <br>
        <v-card v-if="usuario.rol!=='alumno'">
            <v-card-title>
                Tareas pendientes de revisar
            </v-card-title>
            <v-data-table :items="tareasPen" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-btn v-text="'Editar'" color="blue" text small :to="`/Tareas/${item.id}`" />
                    <DeleteDialog :description="`¿Está seguro de querer eliminar la tarea '${item.nombre}'?`"
                        :itemUrl="`/Tareas/${item.id}`" :index="index" list="" item="" />
                </template>
            </v-data-table>
        </v-card>
        <v-card v-else>
            <v-card-title>
                Tareas pendientes de entregar
            </v-card-title>
            <v-data-table :items="tareasPen" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-btn v-text="'ver'" color="blue" text small :to="{ path: `/Tareas/Entrega`,
                    query: { id: item.id } }" />
                </template>
            </v-data-table>
        </v-card>
        <br>
        <v-card v-if="usuario.rol==='alumno'">
            <v-card-title>
                Tareas entregadas
            </v-card-title>
            <v-data-table :items="tareasEnt" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-btn v-text="'ver'" color="blue" text small :to="{ path: `/Tareas/Entrega`,
                    query: { id: item.id } }" />
                </template>
            </v-data-table>
        </v-card>
        <br>
        <v-title v-if="usuario.rol!=='alumno' && proyectos.length!==0" style="font-size: x-large;">Tareas de cada proyecto</v-title>
        <ProjectCard v-if="usuario.rol!=='alumno' && proyectos.length!==0" v-for="proyecto in proyectos" :key="proyecto.id" :proyecto="proyecto" />
    </v-container>
</template>

<script lang="ts">

export default {

    name: 'Tareas',

    middleware: 'auth',

    data: () => ({
        usuario:"",
        tareas: [],
        tareasPen: [],
        proyectos: [],
        tareasEnt: [],
        headers: [
            { text: 'Id de tarea', value: 'id' },
            { text: 'Nombre de la tarea', value: 'nombre' },
            { text: 'Descripcion', value: 'descripcion' },
            { text: 'Comentarios del profesor', value: 'comentarios' },
            { text: 'Fecha de entrega', value: 'fecha_limite' },
            { text: 'Hora de entrega', value: 'hora_limite' },
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
            const date = `${fecha} ${hora}`

            if (this.usuario.rol === "alumno") {
                const resusu = await this.$axios.get(`/Alumnos/${this.usuario.codigo}`)
                const respro = await this.$axios.get(`/Proyectos/${resusu.data.data.proyecto_id}`)
                this.proyectos = this.proyectos.concat(respro.data.data)
            } else {
                const respro = await this.$axios.get(`/Proyectos/Usuario/${this.usuario.codigo}`)
                this.proyectos = respro.data.data
            }

            for (const proyecto of this.proyectos) {
                const responseTareas = await this.$axios.get(`/Tareas/Proyecto/${proyecto.id}`);
                this.tareas = this.tareas.concat(responseTareas.data.data);
            }

            if (this.usuario.rol === "alumno") {
                this.tareas = this.tareas.filter((tarea) => tarea.activo === 1);
                this.tareasPen = this.tareas.filter((tarea) => {
                    const dateEntrega = `${tarea.fecha_limite} ${tarea.hora_limite}`;
                    const entrega = new Date(dateEntrega)
                    return entrega > new Date(date) && tarea.entregada !== 1;
                });
                this.tareasEnt = this.tareas.filter((tarea) => tarea.entregada === 1);
            } else {
                const tar = this.tareas.filter(tarea => tarea.activo === 1)
                this.tareasPen = tar.filter((tarea) => {
                    const dateEntrega = `${tarea.fecha_limite} ${tarea.hora_limite}`;
                    const entrega = new Date(dateEntrega)
                    return entrega < new Date(date);
                });
            }
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }

    },

    methods: {
        deleteElement(index: number) {
            this.tareas.pop(index)
            location.reload();
        }
    }
}
</script>
