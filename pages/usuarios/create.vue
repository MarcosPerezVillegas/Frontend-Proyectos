<template>
    <v-container>
        <v-container v-if="rol === 'alumno' || rol === 'maestro'" justify-center align-center>
            <v-card style="margin-top: 0px; padding: 20px; background-color: #c7eeff; box-shadow: 0 0 20px black;">
                <v-card-title><b>Acceso denegado</b></v-card-title>
                <v-card-text>
                    <b>No tienes el rol necesario para acceder a esta página.</b>
                </v-card-text>
            </v-card>
        </v-container>
        <v-container v-else>
            <v-form @submit.prevent="guardar" class="custom-v-card" style="border-radius: 2%;background-color: #c7eeff;">
                <v-card>
                    <v-card-title class="headline">
                        <b>Registrar Usuario</b>
                    </v-card-title>
                    <v-card-text>
                        <v-alert ref="codigo" v-show="data.codigo" color="error" icon="$error">
                            El código del usuario es necesario y solo debe contener números.
                        </v-alert>

                        <v-alert ref="nombre" v-show="data.nombre" color="error" icon="$error">
                            El nombre del usuario es necesario.
                        </v-alert>

                        <v-alert ref="email" v-show="data.email" color="error" icon="$error">
                            El correo electrónico del usuario es necesario y debe ser valido.
                        </v-alert>
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-text-field v-model="usuario.codigo" outlined label="Código"
                                    :rules="[$validations.notEmpty, $validations.notNumber]"></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-text-field v-model="usuario.nombre" outlined label="Nombre"
                                    :rules="[$validations.notEmpty]"></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-text-field v-model="usuario.email" outlined label="Email"
                                    :rules="[$validations.notEmpty, $validations.isValidEmail]"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-alert ref="pass" v-show="data.iguales" color="error" icon="$error">
                            Las contraseñas no coinciden
                        </v-alert>

                        <v-alert ref="password" v-show="data.password" color="error" icon="$error">
                            La contraseña del usuario es necesaria.
                        </v-alert>

                        <v-alert ref="passconf" v-show="data.passconf" color="error" icon="$error">
                            Nesesitas confirmar la contraseña del usuario.
                        </v-alert>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="usuario.password" outlined label="Contraseña" type="password"
                                    :rules="[$validations.notEmpty]"></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-text-field v-model="usuario.passconf" outlined label="Confirmar contraseña"
                                    type="password" :rules="[$validations.notEmpty]"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-alert ref="rol" v-show="data.rol" color="error" icon="$error">
                            El rol del usuario es necesario.
                        </v-alert>

                        <v-alert ref="telefono" v-show="data.telefono" color="error" icon="$error">
                            El teléfono del usuario debe ser nulo o tener 10 dígitos.
                        </v-alert>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-combobox v-model="roles" outlined label="Rol"
                                    :items="['Administrador', 'Maestro', 'Alumno']"
                                    :rules="[$validations.notEmpty]"></v-combobox>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-text-field v-model="usuario.telefono" outlined label="Telefono"
                                    :rules="[$validations.notPhone]"></v-text-field>
                            </v-col>
                        </v-row>

                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn dark rounded class="white--text" to="/Usuarios" color="#FF0000">
                            <v-icon small>
                                mdi-cancel
                            </v-icon>
                            Cancelar
                        </v-btn>
                        <v-btn dark rounded class="white--text" type="submit" color="#43B63B">
                            <v-icon small>
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
    data: () => ({
        rol: "",
        usuario: {
            codigo: "",
            nombre: "",
            email: "",
            password: "",
            passconf: "",
            telefono: "",
            admin: 0,
        },
        data: {
            codigo: false,
            nombre: false,
            email: false,
            password: false,
            passconf: false,
            telefono: false,
            rol: false,
            iguales: false,
        },
        roles: ""
    }),

    watch: {
        usuario: {
            deep: true,
            handler() {
                this.data.codigo = false
                this.data.nombre = false
                this.data.email = false
                this.data.password = false
                this.data.passconf = false
                this.data.telefono = false
                this.data.iguales = false
            }
        },
        roles: {
            deep: true,
            handler() {
                this.data.rol = false
            }
        }
    },

    async beforeMount() {
        try {
            const respons = await this.$axios.get('/login')
            this.rol = respons.data.rol
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
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
                if (this.usuario.codigo === "") {
                    this.data.codigo = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.codigo);
                    });
                    return
                }
                if (isNaN(Number(this.usuario.codigo))) {
                    this.data.codigo = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.codigo);
                    });
                    return
                }
                if (this.usuario.nombre === "") {
                    this.data.nombre = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.nombre);
                    });
                    return
                }
                if (this.usuario.email === "") {
                    this.data.email = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.email);
                    });
                    return
                }
                // eslint-disable-next-line no-useless-escape
                if (!this.usuario.email.match(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/)) {
                    this.data.email = true;
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.email);
                    });
                    return;
                }
                if (this.usuario.password === "") {
                    this.data.password = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.passwo);
                    });
                    return
                }
                if (this.usuario.passconf === "") {
                    this.data.passconf = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.passconf);
                    });
                    return
                }
                if (this.usuario.password !== this.usuario.passconf) {
                    this.data.iguales = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.pass);
                    });
                    return
                }
                if (this.roles === null || this.roles === "") {
                    this.data.rol = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.rol);
                    });
                    return
                }

                if ((this.usuario.telefono !== "" && this.usuario.telefono.length !== 10) || isNaN(Number(this.usuario.telefono))) {
                    this.data.telefono = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.telefono);
                    });
                    return
                }
                if (this.roles === 'Administrador') {
                    this.usuario.admin = 1
                }
                if (this.roles === 'Maestro' || this.roles === 'Administrador') {
                    try {
                        const response = await this.$axios.post('/Maestros', this.usuario)
                        this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                    } catch (error) {
                        return this.$nuxt.$emit('show-snackbar', 'red', error.response.data.message)
                    }
                } else {
                    try {
                        const response = await this.$axios.post('/Alumnos', this.usuario)
                        this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                    } catch (error) {
                        return this.$nuxt.$emit('show-snackbar', 'red', error.response.data.message)
                    }
                }
            } catch (error) {
                return this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
            this.$router.push('/Usuarios')
        },
    }
}

</script>

<style>
.custom-v-card {
    margin-top: 0px;
    padding: 20px;
    background-color: whitesmoke;
    box-shadow: 0 0 20px black;
}
</style>