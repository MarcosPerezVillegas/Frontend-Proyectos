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
      <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarMessage }}
    </v-snackbar>
    </v-app>
  </template>
  
  <script>
  export default {
    name: 'SingInLayout',

    data () {
        return{
            snackbarColor: '',
            snackbarMessage: '',
            snackbar: false,
            title: 'Registrate!!'
        }
    },
    
    beforeMount() {
    this.$nuxt.$on('show-snackbar', this.showSnackbar)
  },

  methods: {

    showSnackbar(color, message) {
      this.snackbar = true
      this.snackbarColor = color
      this.snackbarMessage = message
    },
  }
}
  </script>
  