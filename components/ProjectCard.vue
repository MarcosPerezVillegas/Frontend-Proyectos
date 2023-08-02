<template>
  <v-container>
    <v-card>
      <v-card-title>{{ proyecto.nombre }}</v-card-title>
      <v-data-table :items="tareas" :headers="headers">
        <template v-slot:item.actions="{ item, index }">
          <v-btn v-text="'Editar'" color="blue" text small :to="`/Tareas/${item.id}`" />
          <DeleteDialog :description="`¿Está seguro de querer eliminar la tarea '${item.nombre}'?`"
            :itemUrl="`/Tareas/${item.id}`" :index="index" list="" item="" />
        </template>
      </v-data-table>
    </v-card>
    <v-card>
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
    <br>
  </v-container>
</template>
  
<script>
export default {
  name: "ProjectCard",
  props: {
    proyecto: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    headers: [
      { text: 'Id de tarea', value: 'id' },
      { text: 'Nombre de la tarea', value: 'nombre' },
      { text: 'Descripcion', value: 'descripcion' },
      { text: 'Comentarios del profesor', value: 'comentarios' },
      { text: 'Fecha de entrega', value: 'fecha_limite' },
      { text: 'Hora de entrega', value: 'hora_limite' },
      { text: 'Acciones', value: 'actions' },
    ],
    tareas: [],
    tareasPen: []
  }),

  async beforeMount() {
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

      const responseTareas = await this.$axios.get(`/Tareas/Proyecto/${this.proyecto.id}`);
      this.tareas = this.tareas.concat(responseTareas.data.data);
      const usuario = await this.$axios.get('/Login')
      if (usuario.data.rol === "alumno") {
        this.tareasPen = this.tareas.filter((tarea) => {
          const dateEntrega = `${tarea.fecha_limite} ${tarea.hora_limite}`;
          const entrega = new Date(dateEntrega)
          return entrega > new Date(date);
        });
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
};
</script>
  