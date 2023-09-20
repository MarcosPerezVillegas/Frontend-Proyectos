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
            <v-form @submit.prevent="guardar" class="custom-v-form" style="background-color: #c7eeff;">
                <v-card>
                    <v-card-title>
                        <b>Crear una carrera</b>
                    </v-card-title>
                    <v-card-text>
                        <v-form>
                            <v-alert ref="clave" v-show="data.clave" color="error" icon="$error">
                                La clave de la carrera es necesario.
                            </v-alert>
                            <v-alert ref="nombre" v-show="data.nombre" color="error" icon="$error">
                                El nombre de la carrera es necesario.
                            </v-alert>
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
                        <v-btn dark rounded to="/Carreras" color="#FF0000">
                            <v-icon>
                                mdi-cancel
                            </v-icon>
                            Cancelar
                        </v-btn>
                        <v-btn dark rounded type="submit" color="#43B63B">
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
        data: {
            nombre: false,
            clave: false
        }
    }),

    watch: {
        carrera: {
            deep: true,
            handler() {
                this.data.nombre = false
                this.data.clave = false
            }
        },
    },

    async beforeMount() {
        const responseR = await this.$axios.get('/login')
        this.rol = responseR.data.rol
    },


    methods: {
        scrollHaciaAlerta(elemento) {
            if (elemento && elemento.$el) {
                const offset = elemento.$el.offsetTop;
                window.scrollTo({
                    top: offset,
                    behavior: "smooth", // Esto hace que el desplazamiento sea suave
                });
            }
        },
        async guardar() {
            try {
                if (this.carrera.nombre === "") {
                    this.data.nombre = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.nombre);
                    });
                    return
                }
                if (this.carrera.clave === "") {
                    this.data.clave = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.Clave);
                    });
                    return
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

<style>
.custom-v-form {
    margin-top: 0px;
    padding: 20px;
    box-shadow: 0 0 20px black;
}
</style>