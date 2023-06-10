<template>
    <v-dialog v-model="deleteDialog" persistent>
        <template v-slot:activator="{ on, attrs }">
            <v-btn v-text="'Eliminar'" color="red" text small v-bind="attrs" v-on="on" />
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
                <v-btn v-text="'Cancelar'" text small @click="deleteDialog = false" />
                <v-btn v-text="'Confirmar'" color="red" text small @click="eliminar" />
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

        index: {
            type: Number,
            required: true,
        }
    },

    data: () => ({
        deleteDialog: false
    }),

    methods: {
        async eliminar() {
            try {
                const response = await this.$axios.delete(this.itemUrl)

                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                this.deleteDialog = false
                this.$nuxt.$emit('remove-from-list', this.index)
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        }
    }
}

</script>