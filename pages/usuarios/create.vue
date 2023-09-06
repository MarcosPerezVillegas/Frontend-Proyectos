<template>
    <v-container>
        <v-container v-if="rol === 'alumno' || rol === 'maestro'" justify-center align-center>
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
                    Registrar Usuario
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="usuario.codigo" label="Codigo" :rules="[$validations.notEmpty, $validations.notNumber]"></v-text-field>
                    <v-text-field v-model="usuario.nombre" label="Nombre" :rules="[$validations.notEmpty]"></v-text-field>
                    <v-text-field v-model="usuario.email" label="Email"
                        :rules="[$validations.notEmpty, $validations.isValidEmail]"></v-text-field>
                    <v-text-field v-model="usuario.password" label="Contraseña" type="password"
                        :rules="[$validations.notEmpty]"></v-text-field>
                        <v-text-field v-model="password" label="Confirmar contraseña" type="password"
                        :rules="[$validations.notEmpty]"></v-text-field>
                    <v-combobox v-model="roles" label="Rol" :items="['Administrador', 'Maestro', 'Alumno']"></v-combobox>
                    <v-text-field v-model="usuario.telefono" label="Telefono" :rules="[$validations.notPhone]"></v-text-field>

                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn to="/Usuarios" color="red">
                        Cancelar
                    </v-btn>
                    <v-btn type="submit" color="green">
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
            telefono: "",
            admin: 0,

        },
        password: "",
        roles: ""
    }),

    async beforeMount() {
        try {
            const respons = await this.$axios.get('/login')
            this.rol = respons.data.rol
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        async guardar() {

            try {
                if (this.usuario.codigo === "" || this.usuario.email === "" || this.usuario.nombre === ""
                    || this.usuario.password === "" || this.password ==="" || this.roles === null) {
                    return this.$nuxt.$emit('show-snackbar', 'orange', 'Completa todos los espación obligatorios antes de continuar')
                }
                if (isNaN(Number(this.usuario.codigo))) {
                    return this.$nuxt.$emit('show-snackbar', 'orange', 'El código del usuario no es valido, solo debe contener numeros')
                }
                if ((this.usuario.telefono !== "" && this.usuario.telefono.length !== 10) || isNaN(Number(this.usuario.telefono))) {
                    return this.$nuxt.$emit('show-snackbar', 'orange', 'El número de telefono solo puede contener números y no debe de superar los 10 digitos')
                }
                if (this.usuario.password !== this.password ) {
                    return this.$nuxt.$emit('show-snackbar', 'orange', 'Las contraseñas no coinciden')
                }
                if (this.roles === 'Administrador') {
                    this.usuario.admin = 1
                }
                if (this.roles === 'Maestro' || this.roles === 'Administrador') {
                    try {
                        const response = await this.$axios.post('/Maestros', this.usuario)
                        this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                    } catch (error) {
                        this.$nuxt.$emit('show-snackbar', 'red', (error as Error).message)
                    }
                } else {
                    try {
                        const response = await this.$axios.post('/Alumnos', this.usuario)
                        this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                    } catch (error) {
                        this.$nuxt.$emit('show-snackbar', 'red', error)
                    }
                }
            } catch (error) {
            }
            this.$router.push('/Usuarios')
        },
    }
}

</script>