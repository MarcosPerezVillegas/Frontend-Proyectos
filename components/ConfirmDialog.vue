<template>
    <v-dialog v-model="confirmDialog" persistent>
        <template v-slot:activator="{ on, attrs }">
            <v-btn v-text="'Inscribirse'" color="verde" text small v-bind="attrs" v-on="on" />
        </template>
        <v-card>
            <v-card-title>
                ¿Desea continuar?
            </v-card-title>
            <v-card-text>
                {{ description }}
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn v-text="'Cancelar'" text small @click="confirmDialog = false" />
                <v-btn v-text="'Confirmar'" color="green" text small @click="insc" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">

export default {
    name: "ConfirmDialog",

    props: {
        description: {
            type: String,
            required: true,
        },

        itemUrl: {
            type: String,
            required: true,
        },
        item: {
            type: String,
            required: true,
        },

        index: {
            type: Number,
            required: true,
        },
        list: {
            type: String,
            required: true,
        },
    },

    data: () => ({
        confirmDialog: false,
        roles: {},
        proyecto: {},
        alum: {}
    }),

    methods: {
        async insc() {
            const id = localStorage.getItem('proId')
            try {
                const response = await this.$axios.get(`/proyectos/${id}`)
                this.proyecto = response.data.data
                const resRol = await this.$axios.get('/Login')
                this.roles = resRol.data
                const rol = this.roles
                const pro = this.proyecto
                const responseA = await this.$axios.get(`/alumnos/${rol.codigo}`)
                this.alum = responseA.data.data
                this.alum.proyecto_id = id
                const responseB = await this.$axios.put(`/alumnos/${rol.codigo}`, this.alum)
                this.proyecto.alumnos = pro.alumnos - 1
                const responseC = await this.$axios.put(`/proyectos/${this.proyecto.id}`, this.proyecto)
                this.$router.push('/proyectos/datos')     
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        }
    }
}

</script>