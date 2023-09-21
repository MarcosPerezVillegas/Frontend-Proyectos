<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
    <v-dialog v-model="restoreDialog" persistent>
        <template v-slot:activator="{ on, attrs }">
            <v-btn color="blue" text small v-bind="attrs" v-on="on">
            <v-icon small>
                mdi-backup-restore
            </v-icon>
            Restaurar
        </v-btn>
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
                <v-btn v-text="'Cancelar'" text small @click="restoreDialog = false" />
                <v-btn v-text="'Confirmar'" color="blue" text small @click="restaurar" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">

// @ts-nocheck

export default {
    name: "RestoreDialog",

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
        },
        list: {
            type: String,
            required: true,
        },
    },

    data: () => ({
        restoreDialog: false,
        usuario: {
            deletedAt: "",
        }
    }),

    methods: {
        async restaurar() {
            try {
                const response = await this.$axios.get(this.itemUrl,this.usuario)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                this.restoreDialog = false
                this.$nuxt.$emit('remove-from-list', this.index, this.list)
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        }
    }
}

</script>