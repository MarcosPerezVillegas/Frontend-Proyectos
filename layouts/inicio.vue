<template>
    <v-app dark>
      <v-app-bar fixed app>
        <v-toolbar-title>{{ title }}
        </v-toolbar-title>
          <v-spacer/>
          <v-btn class="elevation-0" to="/login">Iniciar sesion</v-btn>
      </v-app-bar>
      <v-main>
        <v-container>
          <Nuxt />
        </v-container>
      </v-main>
      <v-footer :absolute="true" app class="footer">
      <v-row justify="center" align="center">
        <v-col class="text-center mt-4" cols="12">
            <span>&copy;CUValles {{ new Date().getFullYear() }}</span>
          </v-col>
          <v-span>Desarrollado por: </v-span>
          <v-span v-for="nombre in nombres" :key="nombre" class="mx-2">
            {{ nombre }}
          </v-span>
          <v-col class="text-center mt-4" cols="12">
            <v-span>Asesor: Erick Jorge Roberto Guerrero Muños</v-span>
          </v-col>
      </v-row>
    </v-footer>
    
    </v-app>
  </template>
  
  <script>
  export default {
    name: 'LoginLayout',

    data: () => ({
        title: 'Banco de proyectos',
        nombres: [
          'Martin de Jesús Luna Barbosa',
          'Damián Morales Damián',
          'Marcos Antonio Pérez Villegas'
        ]
    })
  }
  </script>
  