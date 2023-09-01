<template>
    <v-app dark>
      <v-app-bar fixed app>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </v-app-bar>
      <v-main>
        <v-container>
          <Nuxt />
        </v-container>
      </v-main>
      <v-footer :absolute="true" app>
        <span>&copy; {{ new Date().getFullYear() }}</span>
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
  