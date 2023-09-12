<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>
              Información del Usuario
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="user.fullName"
                  label="Nombre completo"
                  outlined
                  :readonly="!editar"
                ></v-text-field>
  
                <v-text-field
                  v-model="user.email"
                  label="Correo electrónico"
                  outlined
                  :readonly="!editar"
                ></v-text-field>
  
                <v-text-field
                  v-model="user.phoneNumber"
                  label="Número de teléfono"
                  outlined
                  :readonly="!editar"
                ></v-text-field>
  
                <v-text-field
                  v-model="user.code"
                  label="Código de usuario"
                  outlined
                  :readonly="!editar"
                ></v-text-field>
  
                <v-text-field v-if="editar"
                  v-model="user.password"
                  label="Contraseña"
                  outlined
                  type="password"
                ></v-text-field>

                <v-text-field v-if="editar"
                  v-model="user.password"
                  label="Confirmar contraseña"
                  outlined
                  type="password"
                ></v-text-field>
  
                <v-btn @click="toggleeditar" color="primary">{{ editar ? 'Guardar' : 'Editar' }}</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'UserProfile',
    data() {
      return {
        user: {
        },
        editar: false, // Variable para controlar el estado de edición
      };
    },

    async beforeMount(){
    },
    methods: {
      toggleeditar() {
        // Cambia el estado de edición al hacer clic en el botón "Editar" o "Guardar"
        this.editar = !this.editar;
  
        // Si estamos guardando los cambios, aquí es donde deberías enviar una solicitud
        // para actualizar la información del usuario en el servidor, similar al ejemplo anterior.
      },
    },
  };
  </script>