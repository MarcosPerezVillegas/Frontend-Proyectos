<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-card v-if="rol_usuario!== 'Alumno'">
                <v-card-title>
                    Editar usuario
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="usuario.codigo" label="Código"></v-text-field>
                    <v-text-field v-model="usuario.nombre" label="Nombre"></v-text-field>
                    <v-text-field v-model="usuario.email" label="Email"
                        :rules="[$validations.notEmpty, $validations.isValidEmail]"></v-text-field>
                    <v-combobox v-model="rol_usuario" label="Rol"
                        :items="['Administrador', 'Maestro']"></v-combobox>
                    <v-text-field v-model="usuario.telefono" label="Telefono"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="red" to="/Usuarios">
                        Cancelar
                    </v-btn>
                    <v-btn color="green" type="submit">
                        Guardar
                    </v-btn>

                </v-card-actions>
            </v-card>
            <v-card v-else>
                <v-card-title>
                    Editar usuario
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="usuario.codigo" label="Código"></v-text-field>
                    <v-text-field v-model="usuario.nombre" label="Nombre"></v-text-field>
                    <v-text-field v-model="usuario.email" label="Email"
                        :rules="[$validations.notEmpty, $validations.isValidEmail]"></v-text-field>
                    <v-text-field v-model="usuario.telefono" label="Telefono"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="red" to="/Usuarios">
                        Cancelar
                    </v-btn>
                    <v-btn color="green" type="submit">
                        Guardar
                    </v-btn>

                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
</template>

<script lang="ts">

export default {
    name: 'UsuariosUpdate',
    middleware: 'auth',
    data: () => ({
        usuario: {
            codigo: "",
            nombre: "",
            email: "",
            usuario: "",
            telefono: "",
            admin: 0,
        },
        rol_usuario: "",
        rol: "",
        codigo: "",
        rol_inicial: ""
    }),

    async beforeMount() {
        try {
            const response = await this.$axios.get(`${this.$route.query.url}`)
            this.rol_usuario = this.$route.query.rol_usuario
            this.rol_inicial = this.rol_usuario
            this.usuario = response.data.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        async guardar() {
            const resRol = await this.$axios.get('/Login')
            this.rol = resRol.data.rol
            this.codigo = resRol.data.codigo
            try {
                if (this.rol_usuario === null) {
                    return this.$nuxt.$emit('show-snackbar', 'red', "No puedes dejar sin rol al usuario")
                }
                if (this.usuario.codigo === this.codigo && this.$route.query.rol_usuario !== this.rol_usuario) {
                    return this.$nuxt.$emit('show-snackbar', 'red', "No puedes modificar el rol de tu propio usuario")
                }
            }
            catch (error) {
                return this.$nuxt.$emit('show-snackbar', 'red', "Algo salió mal: ", error.message)
            }
            try {
                if (this.rol_inicial !== this.rol_usuario) {
                    if (this.rol_inicial === "Administrador" && this.rol_usuario === "Maestro") {
                        this.usuario.admin = 0
                    }
                }
                if (this.rol_inicial === "Maestro" && this.rol_usuario === "Administrador") {
                    this.usuario.admin = 1
                }
                const response = await this.$axios.put(`${this.$route.query.url}`, this.usuario)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                this.$router.push('/Usuarios')
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        },
    }
}

</script>