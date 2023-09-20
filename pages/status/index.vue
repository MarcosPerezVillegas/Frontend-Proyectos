<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/v-slot-style -->
<template>
    <v-container>
        <v-container v-if="rol === 'alumno' || rol === 'maestro'" justify-center align-center>
            <v-card class="custom-v-card">
                <v-card-title>Acceso Denegado</v-card-title>
                <v-card-text>
                    <p>No tienes el rol necesario para acceder a esta página.</p>
                </v-card-text>
            </v-card>
        </v-container>
        <v-container v-else>
            <v-card-title>
                Lista de todos los estados posibles para los proyectos
            </v-card-title>
            <v-row>
                <v-spacer />
                <v-btn dark rounded v-if="btn === 0" @click="CambiarBTN()" color="green">
                    <v-icon dark>
                        mdi-plus
                    </v-icon>
                    Agregar estado
                </v-btn>
            </v-row>
            <br>
            <v-form class="custom-v-card" style="background-color: #c7eeff;" v-if="btn === 1">
                <v-card>
                    <v-card-title>
                        Crear nuevo estado
                    </v-card-title>
                    <v-card-text>
                        <v-text-field outlined v-model="estado.Estado" label="Ingresa el estado"
                            :rules="[$validations.notEmpty]"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn dark rounded color="red" @click="CambiarBTN()">
                            <v-icon>
                                mdi-cancel
                            </v-icon>
                            Cancelar
                        </v-btn>
                        <v-btn dark rounded @click="CrearEstado()" color="green">
                            <v-icon>
                                mdi-checkbox-marked-circle
                            </v-icon>
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
            <br>
            <v-card-title>
                Estados
            </v-card-title>
            <v-card outlined class="custom-v-card" style="background-color: #c7eeff;">
                <v-data-table :items="estados" :headers="headers" class="custom-data-table-status"
                    :header-props="headerProps"
                    :footer-props="{ itemsPerPageText: 'Estados por página', pageText: '{0} - {1} de {2}' }">
                    <template v-slot:item.actions="{ item, index }">
                        <v-btn v-if="item.id !== 1 && item.id !== 2 && item.id !== 3" v-text="'Editar'" color="blue" text
                            small @click="CambiarBT(item.id, item.Estado)" />
                        <DeleteDialog v-if="item.id !== 1 && item.id !== 2 && item.id !== 3"
                            :description="`¿Está seguro de querer eliminar el status '${item.Estado}'?. Esta acción no se puede deshacer`"
                            :itemUrl="`/Status/${item.id}`" :index="index" list="" @remove-from-list="deleteElement" />
                        <span v-else>
                            Este estado no se puede eliminar ni modificar
                        </span>
                    </template>
                </v-data-table>
            </v-card>
            <br>
            <v-form class="custom-v-card" style="background-color: #c7eeff;" v-if="bt === 1">
                <v-card>
                    <v-card-title>
                        Editar estado ' {{ this.Estado }} '
                    </v-card-title>
                    <v-card-text>
                        <v-text-field outlined v-model="estado.Estado"
                            label="Ingresa el nuevo valor del estado"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn dark rounded color="red" @click="cancelar()">
                            <v-icon>
                                mdi-cancel
                            </v-icon>
                            Cancelar
                        </v-btn>
                        <v-btn dark rounded @click="ActEstado()" color="green">
                            <v-icon>
                                mdi-checkbox-marked-circle
                            </v-icon>
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
            <br>
        </v-container>
    </v-container>
</template>
<script lang="ts">
// @ts-nocheck
import Vue from "vue"
export default Vue.extend({

    name: 'Carreras',
    middleware: 'auth',

    data() {
        return {
            rol: "",
            id: 0,
            Estado: "",
            btn: 0,
            bt: 0,
            estado: {
                Estado: ""
            },
            estados: [],
            headerProps: {
                sortByText: "Ordenar por"
            },
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Estado', value: 'Estado' },
                { text: 'Acciones', value: 'actions' },
            ],
        }
    },


    async beforeMount() {
        this.$nuxt.$on('remove-from-list', this.deleteElement)
        this.$store.commit('setTitle', 'Status')
        const response = await this.$axios.get('/login')
        this.rol = response.data.rol
        try {
            const response = await this.$axios.get('/Status')
            this.estados = response.data.data
            console.log(this.estados)
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error)
        }
    },

    methods: {
        deleteElement(index: number) {
            this.estados.splice(index, 1);
        },

        CambiarBTN() {
            this.btn = this.btn === 0 ? 1 : 0;
            this.bt = 0
            window.scrollTo(0, 0)
        },
        cancelar() {
            this.bt = 0
        },
        CambiarBT(id: number, Estado: string) {
            this.btn = 0
            this.bt = this.bt === 0 ? 1 : 1;
            this.estado.Estado = ""
            this.id = id
            this.Estado = Estado
            window.scrollTo(0, 1000)
        },
        async CrearEstado() {
            try {
                if (this.estado.Estado === "") {
                    return this.CambiarBTN()
                }
                try {
                    await this.$axios.get(`/Status/Estado/${this.estado.Estado}`)
                    return this.$nuxt.$emit('show-snackbar', 'red', 'Ya existe ese Estado')
                } catch { }
                const response = await this.$axios.post(`/Status`, this.estado)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
            location.reload()
        },
        async ActEstado() {
            try {
                if (this.estado.Estado === "") {
                    return this.cancelar()
                }
                try {
                    await this.$axios.get(`/Status/Estado/${this.estado.Estado}`)
                    return this.$nuxt.$emit('show-snackbar', 'red', 'Ya existe ese Estado')
                } catch { }
                const response = await this.$axios.put(`/Status/${this.id}`, this.estado)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
            this.cancelar()
            location.reload()
        }
    }
})

</script>

<style>
.custom-v-card {
    margin-top: 0px;
    padding: 20px;
    background-color: whitesmoke;
    box-shadow: 0 0 20px black;
}

.custom-data-table-status {
    border-style: solid;
    border-width: 2px;
    border-color: #64B5F6;
}

/* Estiliza los encabezados de la tabla */
.custom-data-table-status .v-data-table-header th {
    background-color: #64B5F6;
    /* Color de fondo más oscuro para los encabezados */
    color: white;
    /* Color del texto en los encabezados */
}

/* Estiliza las filas alternas */
.custom-data-table-status tbody tr:nth-of-type(odd) {
    background-color: #fff;
    /* Fondo gris claro para filas impares */
}

.custom-data-table-status tbody tr:nth-of-type(even) {
    background-color: #c7eeff;
    /* Fondo blanco para filas pares */
}

.custom-data-table-status .v-data-footer {
    background-color: #e1e2e3;
}


.custom-data-table-status .v-data-table-header {
    color: white;
}
</style>