<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-card>
                <v-card-title>
                    Registrar Usuario
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="usuario.codigo" label="Codigo" :rules="[$validations.notEmpty,$validations.notNumber]"></v-text-field>
                    <v-text-field v-model="usuario.nombre" label="Nombre" :rules="[$validations.notEmpty]"></v-text-field>
                    <v-text-field v-model="usuario.email" label="Email"
                        :rules="[$validations.notEmpty, $validations.isValidEmail]"></v-text-field>
                    <v-text-field v-model="usuario.password" label="Contraseña" type="password"
                        :rules="[$validations.notEmpty]"></v-text-field>
                    <v-text-field v-model="password" label="Confirmar contraseña" type="password"
                        :rules="[$validations.notEmpty]"></v-text-field>
                    <v-text-field v-model="usuario.telefono" label="Telefono"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn to="/login" color="red">
                        Cancelar
                    </v-btn>
                    <v-btn type="submit" color="green">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
</template>

<script lang="ts">

// @ts-nocheck

export default {
    name: 'UsuariosCreate',
    layout: 'singIn',
    data: () => ({
        maestro: 0,
        password: "",
        usuario: {
            codigo: "",
            nombre: "",
            email: "",
            password: "",
            telefono: "",
        },
    }),
    methods: {
        async guardar() {

            try {
                if (this.usuario.codigo === "" || this.usuario.email === "" || this.usuario.nombre === ""
                    || this.usuario.password === "" || isNaN(Number(this.usuario.codigo))) {
                    return this.$nuxt.$emit('show-snackbar', 'orange', 'Completa todos los espación obligatorios antes de continuar')
                }
                if (this.usuario.password !== this.password) {
                    return this.$nuxt.$emit('show-snackbar', 'orange', 'Las contraseñas no coinciden')
                }
                try {
                    try {
                        await this.$axios.get(`/Alumnos/Email/${this.usuario.email}`)
                        return this.$nuxt.$emit('show-snackbar', 'red', 'El correo electrónico ya está registrado')
                    } catch {
                        try {
                            await this.$axios.get(`/Alumnos/${this.usuario.codigo}`)
                            return this.$nuxt.$emit('show-snackbar', 'red', 'Ya existe  un usuario con este código')
                        } catch { }
                    }
                    const response = await this.$axios.post('/Alumnos', this.usuario)
                    this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                } catch (error) {
                    this.$nuxt.$emit('show-snackbar', 'green', error)
                }
            } catch (error) {
            }
            this.$router.push('/login')
        },
    }
}

</script>