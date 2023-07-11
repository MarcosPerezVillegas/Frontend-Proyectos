<template>
    <v-container fluid>
        <v-row>
            <v-spacer />
            <v-btn to="/Tareas/create">Crear Tarea</v-btn>
        </v-row>
        <br>
        <v-card>
            <v-card-title>
                Todas las tareas
            </v-card-title>
            <v-data-table :items="tareas" :headers="headers">
                <template v-slot:item.actions="{ item, index }">
                    <v-btn v-text="'Editar'" color="blue" text small :to="`/Tareas/${item.id}`" />
                    <DeleteDialog :description="`¿Está seguro de querer eliminar la tarea '${item.nombre}'?`"
                        :itemUrl="`/Tareas/${item.id}`" :index="index" list="" item="" />
                </template>
            </v-data-table>
        </v-card>
        <br>
        <v-card>
            <v-card-title>
                Tareas pendientes
            </v-card-title>
            <v-data-table :items="tareasPen" :headers="headersPen">
                <template v-slot:item.actions="{ item, index }">
                    <v-btn v-text="'Editar'" color="blue" text small :to="`/Tareas/${item.id}`" />
                    <DeleteDialog :description="`¿Está seguro de querer eliminar la tarea '${item.nombre}'?`"
                        :itemUrl="`/Tareas/${item.id}`" :index="index" list="" item="" />
                </template>
            </v-data-table>
        </v-card>

    </v-container>
</template>

<script lang="ts">

export default {

    name: 'Carreras',

    middleware: 'auth',

    data: () => ({
        tareas: [],
        tareasPen: [],
        headersPen: [],
        headers: [
            { text: 'Id de tarea', value: 'id' },
            { text: 'Proyecto', value: 'proyecto.nombre' },
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

            const usuario = await this.$axios.get('/Login')
            const respro = await this.$axios.get(`/Proyectos/Usuario/${usuario.data.codigo}`)
            const proyectos = respro.data.data
    
            for (const proyecto of proyectos) {
                const responseTareas = await this.$axios.get(`/Tareas/Proyecto/${proyecto.id}`);
                this.tareas = this.tareas.concat(responseTareas.data.data);
                console.log(responseTareas.data.data)
            }

            this.tareasPen = this.tareas.filter((tarea) => {
                const dateEntrega = `${tarea.fecha_limite} ${tarea.hora_limite}`;
                const entrega = new Date(dateEntrega)
                return entrega > new Date(date);
            });
            
            this.headersPen = this.headers.slice();
            console.log(this.tareasPen)
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
