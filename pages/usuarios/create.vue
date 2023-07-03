<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-card>
                <v-card-title>
                    Registrar Usuario
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="usuario.codigo" label="Codigo" :rules="[$validations.notEmpty]"></v-text-field>
                    <v-text-field v-model="usuario.nombre" label="Nombre" :rules="[$validations.notEmpty]"></v-text-field>
                    <v-text-field v-model="usuario.email" label="Email"
                    :rules="[$validations.notEmpty, $validations.isValidEmail]" ></v-text-field>
                    <v-text-field v-model="usuario.password" label="Contraseña" type="password" :rules="[$validations.notEmpty]"></v-text-field>
                    <v-combobox v-model="roles" label="Rol" :items="['Administrador','Maestro','Alumno']" ></v-combobox>
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
    layout: 'singIn',
    data: () => ({
        usuario: {
            codigo: "",
            nombre: "",
            email: "",
            password: "",
            telefono: "",
            admin: 0,
            
        },
        roles: ""
    }),

    methods: {
        async guardar() {

            try {
                if(this.usuario.codigo==="" || this.usuario.email==="" || this.usuario.nombre===""
                || this.usuario.password==="" || this.roles===null){
                    return this.$nuxt.$emit('show-snackbar', 'orange', 'Completa todos los espación obligatorios antes de continuar')
                }
                if (this.roles==='Administrador') {
                    this.usuario.admin = 1
                }
                if (this.roles==='Maestro' || this.roles==='Administrador') {
                    try {
                        const response = await this.$axios.post('/Maestros', this.usuario)
                        this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                    } catch (error) {
                        this.$nuxt.$emit('show-snackbar', 'red', error.message)
                    }
                }else {
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