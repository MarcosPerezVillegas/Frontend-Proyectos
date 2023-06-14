<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-card>
                <v-card-title>
                    Registrar Usuario
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="usuario.codigo" label="Codigo"></v-text-field>
                    <v-text-field v-model="usuario.nombre" label="Nombre"></v-text-field>
                    <v-text-field v-model="usuario.email" label="Email"
                    :rules="[$validations.notEmpty, $validations.isValidEmail]" ></v-text-field>
                    <v-text-field v-model="usuario.password" label="Contraseña" type="password"></v-text-field>
                    <v-text-field v-model="usuario.rol_id" label="Rol_ID" type="number"></v-text-field>
                    <v-text-field v-model="usuario.telefono" label="Telefono"></v-text-field>
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
</template>

<script lang="ts">

export default {
    name: 'UsuariosCreate',


    data: () => ({
        usuario: {
            codigo: "",
            nombre: "",
            email: "",
            password: "",
            rol_id: 1,
            telefono: "",
            
        }
    }),

    methods: {
        async guardar() {

            try {
                const response = await this.$axios.post('/usuarios', this.usuario)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                this.$router.push('/usuarios')
            } catch (error) {
            }
        },
    }
}

</script>