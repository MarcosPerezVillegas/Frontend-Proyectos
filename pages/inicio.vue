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
          <v-btn color="primary" to="/login">Iniciar Sesión</v-btn>
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
        hasError: false,
        layout: "inicio"
      }
    },
  
    beforeMount(){
      this.$store.commit('setTitle', 'CUValles')
    },
  
    methods: {
    },
  }
  </script>
  