<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :clipped="clipped" fixed app>
      <v-list v-if="roles.rol == 'administrador'">
        <v-list-item v-for="(item, i) in itemsAdmin" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-action>
            <v-icon>
              mdi-logout
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            Logout
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list v-if="roles.rol == 'maestro'">
        <v-list-item v-for="(item, i) in itemsMaes" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-action>
            <v-icon>
              mdi-logout
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            Logout
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list v-if="roles.rol == 'alumno' && alum.proyecto_id == null">
        <v-list-item v-for="(item, i) in itemsAlum2" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-action>
            <v-icon>
              mdi-logout
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            Logout
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list v-if="roles.rol == 'alumno' && alum.proyecto_id != null">
        <v-list-item v-for="(item, i) in itemsAlum" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-action>
            <v-icon>
              mdi-logout
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            Logout
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ this.$store.state.title }}</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import Cookies from 'js-cookie';
const CryptoJS = require("crypto-js");
export default {
  name: 'DefaultLayout',
  
  data() {
    return {
      snackbarColor: '',
      snackbarMessage: '',
      snackbar: false,
      clipped: false,
      drawer: false,
      fixed: false,
      itemsAdmin: [
        {
          icon: 'mdi-apps',
          title: 'Inicio',
          to: '/',
        },
        {
          icon: 'mdi-account',
          title: 'Usuarios',
          to: '/Usuarios',
        },
        {
          icon: 'mdi-tag',
          title: 'Carreras',
          to: '/Carreras',
        },
        {
          icon: 'mdi-compass',
          title: 'Proyectos',
          to: '/Proyectos',
        },
        {
          icon: 'mdi-clock-alert',
          title: 'Tareas',
          to: '/Tareas',
        },
      ],
      itemsMaes: [
        {
          icon: 'mdi-apps',
          title: 'Inicio',
          to: '/',
        },
        {
          icon: 'mdi-compass',
          title: 'Proyectos',
          to: '/Proyectos',
        },
        {
          icon: 'mdi-clock-alert',
          title: 'Tareas',
          to: '/Tareas',
        },
      ],
      itemsAlum: [
        {
          icon: 'mdi-apps',
          title: 'Inicio',
          to: '/',
        },
        {
          icon: 'mdi-account',
          title: 'Perfil',
          to: '/Usuarios/Perfil',
        },
        {
          icon: 'mdi-compass',
          title: 'Proyectos',
          to: '/Proyectos/datos',
        },
        {
          icon: 'mdi-clock-alert',
          title: 'Tareas',
          to: '/Tareas',
        },
      ],
      itemsAlum2: [
        {
          icon: 'mdi-apps',
          title: 'Inicio',
          to: '/',
        },
        {
          icon: 'mdi-account',
          title: 'Perfil',
          to: '/Usuarios/Perfil',
        },
        {
          icon: 'mdi-compass',
          title: 'Proyectos',
          to: '/Proyectos',
        },
      ],
      roles:{},
      alum: {},
      rol: "",
    };
  },

  computed: {
    
  },
  async beforeMount() {
    this.$nuxt.$on('show-snackbar', this.showSnackbar)
    const responseR = await this.$axios.get('/login')
    this.roles = responseR.data

    if(this.roles.rol === 'alumno'){
      const responseA = await this.$axios.get(`/alumnos/${this.roles.codigo}`)
      this.alum = responseA.data.data
      if(this.alum.proyecto_id){
        const idPro = this.alum.proyecto_id.toString()
        const clave = "Anitalabalatina"
        const idCifrado = CryptoJS.AES.encrypt(idPro, clave).toString();
        localStorage.setItem('proId',idCifrado)
      }
      
    }
    localStorage.removeItem("Tarea");
    localStorage.removeItem("url");
    localStorage.removeItem("codigo");
    localStorage.removeItem("rol");
  },


  methods: {

    showSnackbar(color: string, message: string) {
      this.snackbar = true
      this.snackbarColor = color
      this.snackbarMessage = message
    },
    async getRol(){
      const resRol = await this.$axios.get('/Login')
      this.rol = resRol.data.rol
    },
    logout() {
      localStorage.clear()
      this.$auth.logout();
      this.$router.push('/login');
    },
  },
};
</script>
