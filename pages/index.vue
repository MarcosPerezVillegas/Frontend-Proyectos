<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6" class="text-center">
        <img src="/udg.png" width="200" height="250" alt="Vuetify.js" class="mb-5" />
        <blockquote class="blockquote">
          &#8220;Este sistema almacena datos de proyectos tecnológicos y ayuda a gestionar el progreso de los proyectos&#8221;
          <footer>
            <small>
              <em>Centro Universitario de los Valles</em>
            </small>
          </footer>
        </blockquote>
        <a href="/Proyectos/Disponibles"><p>Ver proyectos disponibles</p></a>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'Index',
  layout:'inicio',
  data() {
    return {
    }
  },

  async beforeMount(){
    this.$store.commit('setTitle', 'CUValles')
    try {
      await this.$axios.get('/login')
      this.$nuxt.setLayout('default');
    } catch {}
  },

  methods: {
  },
}
</script>
