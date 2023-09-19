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
                        <b>Crear una carrera</b>
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
                        <v-btn dark rounded to="/Carreras" color="red" small>
                            <v-icon>
                                mdi-cancel
                            </v-icon>
                            Cancelar
                        </v-btn>
                        <v-btn dark rounded type="submit" color="green" small>
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
    name: 'UsuariosCreate',
    layout: 'default',
    data: () => ({
        rol: "",
        carrera: {
            nombre: "",
            clave: "",
        },
    }),

    async beforeMount() {
        const responseR = await this.$axios.get('/login')
        this.rol = responseR.data.rol
    },


    methods: {
        async guardar() {

            try {
                if (this.carrera.nombre === "" || this.carrera.clave === "") {
                    return this.$nuxt.$emit('show-snackbar', 'orange', 'Completa todos los espación obligatorios antes de continuar')
                }
                try {
                    const response = await this.$axios.post('/Carreras', this.carrera)
                    this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                    this.$router.push('/Carreras')
                    return
                } catch (error) {
                    this.$nuxt.$emit('show-snackbar', 'green', error)
                }
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
            this.$router.push('/Carreras')
        },
    }
}

</script>