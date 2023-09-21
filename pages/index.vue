<template>
  <v-container class="ma-5">
    <v-row justify="center">
      <v-col cols="12" md="6" class="text-center">
        <img src="/udg.png" width="200" height="250" alt="Vuetify.js" class="mx-auto" />
        <blockquote class="blockquote text-center">
          <p class="mb-0">&#8220;Este sistema almacena datos de proyectos tecnológicos y ayuda a gestionar el progreso de los mismos&#8221;</p>
          <footer class="blockquote-footer">
            <small>
              <em>Centro Universitario de los Valles</em>
            </small>
          </footer>
        </blockquote>
        <a v-if="log" href="/Proyectos"><p>Ver proyectos disponibles</p></a>
        <a v-else href="/Proyectos/Disponibles"><p>Ver proyectos disponibles</p></a>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'Index',
  layout:'default',
  data() {
    return {
      log: false
    }
  },

  

  async beforeMount(){
    this.$store.commit('setTitle', 'CUValles')
    try {
      await this.$axios.get('/login')
      this.log = true
    } catch {
      this.$nuxt.setLayout('inicio');
    }
  },
  

  methods: {
  },
}
</script>
