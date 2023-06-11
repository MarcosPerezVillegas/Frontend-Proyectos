<template>
    <v-app>
        <v-content>
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
                                <v-btn type="submit" color="primary" block>Iniciar Sección</v-btn>
                            </v-card-actions>
                            <v-card-accions>
                                <a :href="''" ><p style="text-align: center; margin: .5ch;">¿Olvidaste tu contraseña?</p></a>
                                <a :href="'/usuarios/create'" ><p style="text-align: center; margin: 1ch;">¿Aun no estas registrado?</p></a>
                            </v-card-accions>
                        </v-card>
                    </v-form>
                    </v-col>
                </v-row>
            </v-container>
        </v-content>
    </v-app>
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
                this.$router.push('/')
            } catch (error) {
                this.hasError = true
            }

        },
    }
}
</script>
  