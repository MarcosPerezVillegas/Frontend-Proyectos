<template>
    <v-container>
        <v-form v-model="validForm" ref="form" @submit.prevent="loginUser">
            <v-alert v-show="hasError" color="error" icon="$error">
                Usuario no encontrado o contraseña incorrecta.
            </v-alert>
            <v-card>
                <v-card-title>
                    <v-spacer />
                    Bienvenido
                    <v-spacer />
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="login.email" label="Email"
                    :rules="[$validations.notEmpty, $validations.isValidEmail]" />
                    <v-text-field v-model="login.password" label="Password" type="password" 
                    :rules="[$validations.notEmpty]"/>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                        <v-btn type="submit">Login</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
</template>
  
<script lang="ts">

export default {

    name: "Login",
    auth: 'guest',
    layout: 'login',

    data: () => ({
        validForm: true,
        hasError: false,
        login: {
                email: "",
                password: ""
        }
    }),

    watch: {
        login: {
            deep: true,
            handler() {
                this.hasError= false
            }
        }
    },
    
    beforeMount() {
        if (this.$auth.loggedIn) {
            this.$router.push('/')
        }
    },

    methods: {
        async loginUser() {
            this.$refs.form.validate()
            if(!this.validForm) return
            try {
                const response = await this.$auth.loginWith('local',{data: this.login})
                this.$router.push('/')
            } catch (error) {
                this.hasError = true
            }
            
        },
    }
}
</script>
  