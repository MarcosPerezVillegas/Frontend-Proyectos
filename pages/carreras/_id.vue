<template>
    <v-container>
        <v-container v-if="rol !== 'administrador'" justify-center align-center>
            <v-card>
                <v-card-title>Acceso Denegado</v-card-title>
                <v-card-text>
                    <p>No tienes el rol necesario para acceder a esta página.</p>
                </v-card-text>
            </v-card>
        </v-container>
        <v-container v-else>
            <v-form @submit.prevent="guardar">
                <v-card>
                    <v-card-title>
                        Editar usuario
                    </v-card-title>
                    <v-card-text>
                        <v-form>
                            <v-row>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="carrera.clave" outlined label="Clave"
                                        :rules="[$validations.notEmpty]"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="7">
                                    <v-text-field v-model="carrera.nombre" outlined label="Nombre"
                                        :rules="[$validations.notEmpty]"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn dark rounded color="red" to="/Carreras" small>
                            <v-icon>
                                mdi-cancel
                            </v-icon>
                            Cancelar
                        </v-btn>
                        <v-btn dark rounded color="green" type="submit" small>
                            <v-icon>
                                mdi-checkbox-marked-circle
                            </v-icon>
                            Guardar
                        </v-btn>

                    </v-card-actions>
                </v-card>
            </v-form>
        </v-container>
    </v-container>
</template>

<script lang="ts">

// @ts-nocheck

export default {
    name: 'UsuariosUpdate',
    middleware: 'auth',
    data: () => ({
        rol: "",
        clave: "",
        carrera: {
            clave: "",
            nombre: "",
        },
    }),

    async beforeMount() {
        this.clave = this.$route.params.id
        const responseR = await this.$axios.get('/login')
        this.rol = responseR.data.rol

        try {
            const response = await this.$axios.get(`/Carreras/${this.clave}`)

            this.carrera = response.data.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        async guardar() {
            try {
                const response = await this.$axios.put(`/Carreras/${this.clave}`, this.carrera)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                this.$router.push('/Carreras')
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        },
    }
}

</script>