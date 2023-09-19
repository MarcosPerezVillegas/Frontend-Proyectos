<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
    <v-dialog v-model="removeState" persistent>
        <template v-slot:activator="{ on, attrs }">
            <v-btn dark rounded color="red" text small v-bind="attrs" v-on="on" @click="removeState = true" small>
                <v-icon small>
                    mdi-delete
                </v-icon>
                Eliminar
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
                <v-btn v-text="'Cancelar'" color="red" text small @click="removeState = false" />
                <v-btn v-text="'Confirmar'" color="blue" text small @click="eliminar" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">

// @ts-nocheck

export default {
    name: "RemoveState",

    props: {
        description: {
            type: String,
            required: true,
        },

        id: {
            type: String,
            required: true,
        },

        estado: {
            type: String,
            required: true,
        },

        index: {
            type: Number,
            required: true,
        },
    },

    data: () => ({
        removeState: false,
        Estado:{
            status_id: Number,
            dele: 1
        }
    }),


methods: {
        async eliminar() {
        try {
            const res = await this.$axios.get(`/Status/Estado/${this.estado}`);
            this.Estado.status_id = res.data.data.id;
            const response = await this.$axios.put(`/Proyectos/${this.id}`,this.Estado)
            this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
            this.removeState = false
            this.$nuxt.$emit('remove-from-list', this.index)
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.response.data.message)
        }
    }
}
}

</script>