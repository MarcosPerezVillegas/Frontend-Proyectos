<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/valid-v-slot -->
<!-- eslint-disable vue/v-slot-style -->
<template>
    <v-container>
        <v-container v-if="rol !== 'administrador'" justify-center align-center>
            <v-form class="custom-v-form">
                <v-card>
                    <v-card-title class="headline"><b>Acceso denegado</b></v-card-title>
                    <v-card-text>
                        <b>No tienes el rol necesario para acceder a esta página.</b>
                    </v-card-text>
                </v-card>
            </v-form>
        </v-container>
        <v-container v-else>
            <v-card-title>
                Lista de todas las carreras
            </v-card-title>
            <v-row>
                <v-spacer />
                <v-btn dark rounded color="#43B63B" v-if="btn === 0" @click="CambiarBTN()">
                    <v-icon dark>
                        mdi-plus
                    </v-icon>
                    Registrar una nueva carrera
                </v-btn>
            </v-row>
            <br>
            <v-form class="custom-v-form" v-if="btn === 1">
                <v-card>
                    <v-card-title>
                        Registrar una nueva carrera
                    </v-card-title>
                    <v-card-text>
                        <v-alert ref="carrera" v-show="data.clave" color="error" icon="$error">
                            La clave de la carrea es obligatoria.
                        </v-alert>
                        <v-alert ref="carrera2" v-show="data.nombre" color="error" icon="$error">
                            El nombre de la carrea es obligatorio.
                        </v-alert>
                        <v-alert ref="carrera3" v-show="data.existe" color="error" icon="$error">
                            Ya existe una carrera con esa clave.
                        </v-alert>
                        <v-alert ref="carrera4" v-show="data.existe2" color="error" icon="$error">
                            Ya existe una carrera con ese nombre.
                        </v-alert>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field outlined v-model="carrera.clave" label="Clave"
                                    :rules="[$validations.notEmpty]"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field outlined v-model="carrera.nombre" label="Nombre"
                                    :rules="[$validations.notEmpty]"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn dark rounded color="red" @click="CambiarBTN()">
                            <v-icon small>
                                mdi-cancel
                            </v-icon>
                            Cancelar
                        </v-btn>
                        <v-btn dark rounded @click="CrearCarrera()" color="green">
                            <v-icon small>
                                mdi-checkbox-marked-circle
                            </v-icon>
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
            <v-card-title>
                Carreras
            </v-card-title>
            <v-form class="custom-v-form">
                <v-card>
                    <v-data-table :items="carreras" :headers="headers" class="custom-data-table-carreras"
                        :header-props="headerProps"
                        :footer-props="{ itemsPerPageText: 'Carreras por página', pageText: '{0} - {1} de {2}' }">
                        <template v-slot:item.actions="{ item, index }">
                            <v-menu offset-y v-if="item.id !== 1 && item.id !== 2 && item.id !== 3">
                                <template #activator="{ on }">
                                    <v-btn color="#64B5F6" text v-on="on" small>
                                        <v-icon>
                                            mdi-format-list-bulleted-square
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <v-list
                                    style="background-color: white; border-width: 5px; border-color: #c7eeff; border-style: solid;">
                                    <v-list-item>
                                        <v-list-item-action>
                                            <v-btn color="blue" text small @click="CambiarBT(item)">
                                                <v-icon small>
                                                    mdi-border-color
                                                </v-icon>
                                                Editar
                                            </v-btn>
                                        </v-list-item-action>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-action>
                                            <DeleteDialog
                                                :description="`¿Está seguro de querer eliminar el estado '${item.nombre}'?`"
                                                :itemUrl="`/Carreras/${item.clave}`" :index="index" list=""
                                                @remove-from-list="deleteElement" />
                                        </v-list-item-action>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </template>
                    </v-data-table>
                </v-card>
            </v-form>
            <br>
            <v-form class="custom-v-form" v-if="bt === 1">
                <v-card>
                    <v-card-title>
                        Editar carrera '{{ Carrera }}'
                    </v-card-title>
                    <v-card-text>
                        <v-alert ref="carrera" v-show="data.clave" color="error" icon="$error">
                            La clave de la carrea es obligatoria.
                        </v-alert>
                        <v-alert ref="carrera2" v-show="data.nombre" color="error" icon="$error">
                            El nombre de la carrea es obligatorio.
                        </v-alert>
                        <v-alert ref="carrera3" v-show="data.existe" color="error" icon="$error">
                            Ya existe una carrera con esa clave.
                        </v-alert>
                        <v-alert ref="carrera4" v-show="data.existe2" color="error" icon="$error">
                            Ya existe una carrera con ese nombre.
                        </v-alert>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field outlined v-model="carrera.clave" label="Clave"
                                    :rules="[$validations.notEmpty]"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field outlined v-model="carrera.nombre" label="Nombre"
                                    :rules="[$validations.notEmpty]"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn dark rounded color="#FF0000 " @click="cancelar()">
                            <v-icon>
                                mdi-cancel
                            </v-icon>
                            Cancelar
                        </v-btn>
                        <v-btn dark rounded color="#43B63B  " @click="ActCarrea()">
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
// @ts-nocheck
<script lang="ts">
// @ts-nocheck
import Vue from "vue"
export default Vue.extend({

    name: 'Carreras',
    middleware: 'auth',

    data() {
        return {
            clave: "",
            rol: "",
            carreras: [],
            headerProps: {
                sortByText: "Ordenar por"
            },
            carrera: {
                nombre: "",
                clave: ""
            },
            Carrera: "",
            data: {
                nombre: false,
                existe: false,
                existe2: false,
                clave: false
            },
            btn: 0,
            bt: 0,
            headers: [
                { text: 'Clave', value: 'clave' },
                { text: 'Nombre', value: 'nombre' },
                { text: 'Acciones', value: 'actions' },
            ],
        }
    },

    watch: {
        carrera: {
            deep: true,
            handler() {
                this.data.nombre = false,
                    this.data.clave = false,
                    this.data.existe = false,
                    this.data.existe2 = false
            }
        },
    },

    async beforeMount() {
        this.$nuxt.$on('remove-from-list', this.deleteElement)
        this.$store.commit('setTitle', 'Carreras')
        const responseR = await this.$axios.get('/login')
        this.rol = responseR.data.rol
        if (this.rol !== 'administrador') {
            return
        }
        try {
            const response = await this.$axios.get('/Carreras')
            this.carreras = response.data.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error)
        }
    },

    methods: {
        scrollHaciaAlerta(elemento) {
            if (elemento && elemento.$el) {
                const offset = elemento.$el.offsetTop;
                window.scrollTo({
                    top: offset,
                    behavior: "smooth", // Esto hace que el desplazamiento sea suave
                });
            }
        },

        CambiarBTN() {
            this.btn = this.btn === 0 ? 1 : 0;
            this.bt = 0
            window.scrollTo(0, 0)
        },
        CambiarBT(Carrera: Object) {
            this.btn = 0
            this.bt = this.bt === 0 ? 1 : 1;
            this.carrera.clave = ""
            this.carrera.nombre = ""
            this.clave = Carrera.clave
            this.Carrera = Carrera.nombre
            window.scrollTo(0, 1000)
        },
        cancelar() {
            this.bt = 0
        },
        async CrearCarrera() {
            try {
                if (this.carrera.clave === "") {
                    this.data.clave = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.carrea);
                    });
                    return
                }
                if (this.carrera.nombre === "") {
                    this.data.nombre = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.carrea2);
                    });
                    return
                }
                try {
                    await this.$axios.get(`/Carreras/${this.carrera.clave}`)
                    this.data.existe = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.carrea3);
                    });
                    return
                } catch (error) { }
                try {
                    await this.$axios.get(`/Carreras/Nombre/${this.carrera.nombre}`)
                    this.data.existe2 = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.carrea4);
                    });
                    return
                } catch (error) { }
                const response = await this.$axios.post(`/Carreras`, this.carrera)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
            location.reload()
        },

        async ActCarrea() {
            try {
                if (this.carrera.clave === "") {
                    this.data.clave = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.carrea);
                    });
                    return
                }
                if (this.carrera.nombre === "") {
                    this.data.nombre = true
                    this.$nextTick(() => {
                        this.scrollHaciaAlerta(this.$refs.carrea2);
                    });
                    return
                }
                if (this.clave !== this.carrera.clave) {
                    try {
                        await this.$axios.get(`/Carreras/${this.carrera.clave}`)
                        this.data.existe = true
                        this.$nextTick(() => {
                            this.scrollHaciaAlerta(this.$refs.carrea3);
                        });
                        return
                    } catch (error) { }
                }
                if (this.Carrera !== this.carrera.nombre) {
                    try {
                        await this.$axios.get(`/Carreras/Nombre/${this.carrera.nombre}`)
                        this.data.existe2 = true
                        this.$nextTick(() => {
                            this.scrollHaciaAlerta(this.$refs.carrea4);
                        });
                        return
                    } catch (error) { }
                } if (this.Carrera === this.carrera.nombre && this.clave === this.carrera.clave) {
                    this.cancelar()
                    return
                }
                const response = await this.$axios.put(`/Carreras/${this.clave}`, this.carrera)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
            this.cancelar()
            location.reload()
        },

        deleteElement(index: number) {
            this.carreras.splice(index, 1);
            location.reload()
        }
    }
})

</script>

<style>
.custom-v-form {
    margin-top: 0px;
    padding: 20px;
    box-shadow: 0 0 20px black;
    background-color: #c7eeff;
    border-radius: 2%;
}

.custom-data-table-carreras {
    border-style: solid;
    border-width: 2px;
    border-color: #64B5F6;
}

/* Estiliza los encabezados de la tabla */
.custom-data-table-carreras .v-data-table-header th {
    background-color: #64B5F6;
    /* Color de fondo más oscuro para los encabezados */
    color: white;
    /* Color del texto en los encabezados */
}

/* Estiliza las filas alternas */
.custom-data-table-carreras tbody tr:nth-of-type(odd) {
    background-color: #fff;
    /* Fondo gris claro para filas impares */
}

.custom-data-table-carreras tbody tr:nth-of-type(even) {
    background-color: #c7eeff;
    /* Fondo blanco para filas pares */
}

.custom-data-table-carreras .v-data-footer {
    background-color: #e1e2e3;
}


.custom-data-table-carreras .v-data-table-header {
    color: white;
}
</style>
