<template>
    <v-app>
      <v-content>
        <v-container fluid>
          <v-row justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
              <v-card class="login-card">
                <v-card-title class="text-center">Bienvenido!!</v-card-title>
                <v-card-text>
                  <v-form @submit.prevent="login">
                    <v-text-field v-model="email" label="Correo electrónico" required></v-text-field>
                    <v-text-field v-model="password" label="Contraseña" type="password" required></v-text-field>
                    <v-btn type="submit" color="primary" block>Iniciar sesión</v-btn>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-content>
      <v-footer app>
        <span class="white--text">&copy; 2023 Tu Empresa</span>
      </v-footer>
    </v-app>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      login() {
        // Lógica para iniciar sesión
        console.log('Iniciando sesión...')
      }
    }
  }
  </script>
  
  <style scoped>
  .login-card {
    margin-top: 100px;
    padding: 24px;
  }
  </style>
  