<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :clipped="clipped" fixed app>
      <v-list v-if="admin">
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

      <v-list v-else>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
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
      items: [
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
          icon: 'mdi-account',
          title: 'Usuarios',
          to: '/Usuarios',
        },
        {
          icon: 'mdi-clock-alert',
          title: 'Tareas',
          to: '/Tareas',
        },
        
      ],
      itemsAdmin: [
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
          icon: 'mdi-account',
          title: 'Usuarios',
          to: '/Usuarios',
        },
      ],
    };
  },

  computed: {
    admin(){
      const rol = Cookies.get('rol')
      return rol ==='administrador'
    }
  },
  beforeMount() {
    this.$nuxt.$on('show-snackbar', this.showSnackbar)
  },


  methods: {

    showSnackbar(color: string, message: string) {
      this.snackbar = true
      this.snackbarColor = color
      this.snackbarMessage = message
    },

    logout() {
      Cookies.remove('alumno')
      Cookies.remove('administrador')
      Cookies.remove('maestro')
      this.$auth.logout();
      this.$router.push('/login');
    },
  },
};
</script>
