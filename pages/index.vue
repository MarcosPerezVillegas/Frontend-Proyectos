<template>
  <v-row>
    <v-col class="text-center">
      <img src="/v.png" alt="Vuetify.js" class="mb-5" />
      <blockquote class="blockquote">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote>
    </v-col>
  </v-row>
</template>

<script>

import Cookies from 'js-cookie';

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
