<template>
  <v-row>
    <v-col class="text-center">
      <img src="/udg.png" width="200" height="250" alt="Vuetify.js" class="mb-5" />
      <blockquote class="blockquote">
        &#8220;Este sistema almacena datos de proyectos tecnológicos y ayuda a gestionar el progreso de los proyectos&#8221;
        <footer>
          <small>
            <em>Centro Universitario de los Valles</em>
          </small>
        </footer>
      </blockquote>
    </v-col>
  </v-row>
</template>

<script>

export default {
  name: 'Index',
  layout:'default',
  middleware: 'auth',
  data() {
    return {
      hasError: false,
      layout: "default"
    }
  },

  beforeMount(){
    this.$store.commit('setTitle', 'CUValles')
  },

  methods: {
  },
}
</script>
