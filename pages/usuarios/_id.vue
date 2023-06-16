<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-card>
                <v-card-title>
                    Editar usuario
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="usuario.codigo" label="Código"></v-text-field>
                    <v-text-field v-model="usuario.nombre" label="Nombre"></v-text-field>
                    <v-text-field v-model="usuario.email" label="Email"
                    :rules="[$validations.notEmpty, $validations.isValidEmail]" ></v-text-field>
                    <v-text-field v-model="usuario.Rol_Usuario.id" label="Rol_ID" type="number"></v-text-field>
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
            Rol_Usuario: {
                id: "",
            },
            rol_id: "",
            telefono: "",
        }
    }),

    async beforeMount() {
        const id = this.$route.params.id
        
        try {
            const response = await this.$axios.get(`/Usuarios/${id}`)

            this.usuario = response.data.data
            this.usuario.rol_id=this.usuario.Rol_Usuario.id
        } catch (error) {   
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        async guardar() {
            try {
                console.log(this.usuario)
                const response = await this.$axios.put(`/Usuarios/${this.usuario.codigo}`, this.usuario)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                this.$router.push('/Usuarios')
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        },
    }
}

</script>