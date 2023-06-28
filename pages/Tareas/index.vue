<template>
  <v-container>
      <v-row>
          <v-spacer />
          <v-btn to="/Tareas/create">Crear Tarea</v-btn>
      </v-row>
      <br>
      <v-card>
          <v-data-table :items="tareas" :headers="headers">
              <template v-slot:item.actions="{ item, index }">
                  <v-btn v-text="'Editar'" color="blue" text small :to="`/Tareas/${item.id}`" />
                  <DeleteDialog :description="`¿Está seguro de querer eliminar la tarea '${item.nombre}'?`"
                      :itemUrl="`/Tareas/${item.id}`" :index="index" />
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
      headers: [
          { text: 'Id de tarea', value: 'id' },
          { text: 'Id del proyecto', value: 'Proyecto_id' },
          { text: 'Nombre', value: 'nombre' },
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
          const response = await this.$axios.get('/Tareas')
          this.tareas = response.data.data
      } catch (error) {

      }
      
  },

  methods: {
      deleteElement(index: number) {
          console.log(index)
          this.tareas.pop(index)
      }
  }
}

</script>
