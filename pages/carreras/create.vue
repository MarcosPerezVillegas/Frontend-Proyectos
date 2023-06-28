<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-card>
                <v-card-title>
                    Registrar Usuario
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="carrera.nombre" label="Nombre" :rules="[$validations.notEmpty]"></v-text-field>
                    <v-text-field v-model="carrera.clave" label="Clave" :rules="[$validations.notEmpty]"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn to="/Carreras" color="red">
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
        carrera: {
            nombre: "",
            clave: "",
        },
    }),

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