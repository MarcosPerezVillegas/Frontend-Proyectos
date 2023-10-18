<template>
    <v-app dark>
      <v-app-bar fixed app>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer/>
          <v-btn class="elevation-0" to="/">Inicio</v-btn>
      </v-app-bar>
      <v-main>
        <v-container>
          <Nuxt />
        </v-container>
      </v-main>
      <v-footer :absolute="true" app>
        <span>&copy;CUValles {{ new Date().getFullYear() }}</span>
      </v-footer>
    </v-app>
  </template>
  
  <script>
  export default {
    name: 'LoginLayout',

    data: () => ({
        title: 'Inicia sesión o crea una cuenta'
    })
  }
  </script>
  