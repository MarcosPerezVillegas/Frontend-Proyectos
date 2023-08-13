<template>
    <v-dialog v-model="deleteDialog" persistent>
        <template v-slot:activator="{ on, attrs }">
            <v-btn v-text="'Eliminara'" color="red" text small v-bind="attrs" v-on="on" @click="deleteDialog = true" />
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
                <v-btn v-text="'Cancelar'" color="red" text small @click="deleteDialog = false" />
                <v-btn v-text="'Confirmar'" color="blue" text small @click="eliminar" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">

export default {
    name: "DeleteDialog",

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
            required: false,
            default: ""
        },

        index: {
            type: Number,
            required: true,
        },
        list: {
            type: String,
            required: false,
            default: ""
        },
    },

    data: () => ({
        deleteDialog: false
    }),


methods: {
        async eliminar() {
        try {
            const resRol = await this.$axios.get('/Login')
            try {
                const response1 = await this.$axios.get(`Maestros/${resRol.data.codigo}`)
                if (this.item === response1.data.data.codigo) {
                    this.deleteDialog = false
                    return this.$nuxt.$emit('show-snackbar', 'red', "No puedes eliminar tu propio usuario")
                }
            } catch { }
            const response1 = await this.$axios.get(`Maestros/${resRol.data.codigo}`)
            if (this.item === response1.data.data.codigo) {
                this.deleteDialog = false
                return this.$nuxt.$emit('show-snackbar', 'red', "No puedes eliminar tu propio usuario")
            }
            const response = await this.$axios.delete(this.itemUrl)
            this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
            this.deleteDialog = false
            if (this.list === "") {
                this.$nuxt.$emit('remove-from-list', this.index)
            } else {
                this.$nuxt.$emit('remove-from-list', this.index, this.list)
            }
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    }
}
}

</script>