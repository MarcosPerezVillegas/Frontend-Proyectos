<template>
    <v-app>
        <v-main>
            <v-container fluid>
                <v-row justify="center">
                    <v-col cols="12" sm="8" md="6" lg="4">
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
                                        :rules="[$validations.notEmpty]" />
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn type="submit" color="primary" block>Iniciar Sesión</v-btn>
                                </v-card-actions>
                                <div class="text-center" style="margin: .5cm;">
                                    <a :href="''"><p>¿Olvidaste tu contraseña?</p></a>
                                    <a :href="'/Usuarios/Register'"><p>¿Aun no estás registrado?</p></a>
                                    <br>
                                </div>
                            </v-card>
                        </v-form>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>
  
<script lang="ts">
import Cookies from 'js-cookie';

export default {

    name: "Login",
    auth: 'guest',
    layout: 'login',

    data() {
        return {
            validForm: true,
            hasError: false,
            login: {
            email: "",
            password: ""
        }
        }
    },

    watch: {
        login: {
            deep: true,
            handler() {
                this.hasError = false
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
            if (!this.validForm) return
            try {
                const response = await this.$auth.loginWith('local', { data: this.login })
                const email = this.login.email
                try {
                    const responseA = await this.$axios.get(`/Administradores/Email/${email}`)
                    Cookies.set('rol','administrador',{secure: true})
                }catch (error) {
                    try {
                        const responseM = await this.$axios.get(`/Maestros/Email/${email}`)
                        Cookies.set('rol','maestro',{secure: true})
                    } catch (error) {
                        const responseA = await this.$axios.get(`/Alumnos/Email/${email}`)
                        Cookies.set('rol','alumno',{secure: true})
                    }
                }
                
            } catch (error) {
                this.hasError = true
            }
            this.$router.push('/')
        }
    }
}
</script>
  