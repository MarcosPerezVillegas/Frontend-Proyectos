<template>
    <v-container>
        <v-container v-if="load">
            <v-form class="custom-v-form">
                <v-card>
                    <v-card-title class="headline"><b>Cargando...</b></v-card-title>
                    <v-card-text>
                        <b>Por favor espere....</b>
                    </v-card-text>
                </v-card>
            </v-form>
        </v-container>
        <v-container v-else-if="rol === 'alumno' || rol === 'maestro'" justify-center align-center>
            <v-form v-if="!co" class="custom-v-form">
                <v-card>
                    <v-card-title class="headline"><b>Acceso denegado</b></v-card-title>
                    <v-card-text>
                        <b>No tienes el rol necesario para acceder a esta página.</b>
                    </v-card-text>
                </v-card>
            </v-form>
            <v-form v-else class="custom-v-form">
                <v-card>
                    <v-card-title class="headline">
                        <b>Información del Usuario</b>
                    </v-card-title>
                    <v-card-text>
                        <v-form>
                            <v-alert ref="codigo" v-show="data.codigo" color="error" icon="$error">
                                Tu código es necesario y solo debe contener números.
                            </v-alert>

                            <v-alert ref="nombre" v-show="data.nombre" color="error" icon="$error">
                                Tu nombre es necesario
                            </v-alert>

                            <v-alert ref="email" v-show="data.email" color="error" icon="$error">
                                Tu correo electrónico es necesario y debe ser válido.
                            </v-alert>

                            <v-row>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="usuario.codigo" outlined label="Código de usuario"
                                        :readonly="!editar"
                                        :rules="[$validations.notEmpty, $validations.notNumber]"></v-text-field>
                                </v-col>

                                <v-col cols="12" md="4">
                                    <v-text-field v-model="usuario.nombre" outlined label="Nombre completo"
                                        :readonly="!editar" :rules="[$validations.notEmpty]"></v-text-field>
                                </v-col>

                                <v-col cols="12" md="4">
                                    <v-text-field v-model="usuario.email" outlined label="Correo electrónico"
                                        :readonly="!editar"
                                        :rules="[$validations.notEmpty, $validations.isValidEmail]"></v-text-field>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-alert ref="telefono" v-show="data.telefono" color="error" icon="$error">
                                        Tu número de teléfono debe ser nulo o tener 10 dígitos.
                                    </v-alert>
                                    <v-text-field v-model="usuario.telefono" outlined label="Número de teléfono"
                                        :readonly="!editar" :rules="[$validations.notPhone]"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-alert ref="iguales" v-show="data.iguales" color="error" icon="$error">
                                Las contraseñas no coinciden.
                            </v-alert>
                            <v-row>
                                <v-col cols="12" md="5">
                                    <v-text-field v-if="editar" v-model="pass.cont" outlined label="Contraseña"
                                        type="password"></v-text-field>
                                    <v-text-field v-if="editar" v-model="pass.confCont" outlined
                                        label="Confirmar contraseña" type="password"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row justify="center">
                                <v-btn @click="toggleeditar" dark rounded class="white--text" color="primary">
                                    <v-icon v-if="!editar" small>
                                        mdi-border-color
                                    </v-icon>
                                    <v-icon v-else small>
                                        mdi-checkbox-marked-circle
                                    </v-icon>
                                    {{ editar ?
                                        'Guardar' : 'Editar' }}</v-btn>
                                <v-btn @click="cancelarEditar" dark rounded class="white--text" color="#FF0000">
                                    <v-icon small>
                                        mdi-cancel
                                    </v-icon>
                                    Cancelar</v-btn>
                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-form>
        </v-container>
        <v-container v-else>
            <v-form @submit.prevent="guardar" class="custom-v-form">
                <v-card>
                    <v-card-title class="headline">
                        <b>Editar usuario</b>
                    </v-card-title>
                    <v-card-text>
                        <v-alert ref="codigo" v-show="data.codigo" color="error" icon="$error">
                            El código del usuario es necesario y solo debe contener números.
                        </v-alert>

                        <v-alert ref="nombre" v-show="data.nombre" color="error" icon="$error">
                            El nombre del usuario es necesario
                        </v-alert>

                        <v-alert ref="email" v-show="data.email" color="error" icon="$error">
                            El correo electrónico del usuario es necesario y debe ser válido.
                        </v-alert>
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-text-field v-model="usuario.codigo" outlined label="Código"
                                    :rules="[$validations.notEmpty, $validations.notNumber]"></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-text-field v-model="usuario.nombre" outlined label="Nombre"
                                    :rules="[$validations.notEmpty]"></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-text-field v-model="usuario.email" outlined label="Email"
                                    :rules="[$validations.notEmpty, $validations.isValidEmail]"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-alert ref="telefono" v-show="data.telefono" color="error" icon="$error">
                            El teléfono del usuario debe ser nulo o tener 10 dígitos.
                        </v-alert>

                        <v-alert ref="rol" v-show="data.rol" color="error" icon="$error">
                            El rol del usuario es necesario.
                        </v-alert>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="usuario.telefono" outlined label="Telefono"
                                    :rules="[$validations.notPhone]"></v-text-field>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-combobox v-if="rol_inicial !== 'Alumno'" v-model="rol_usuario" label="Rol" outlined
                                    :items="['Administrador', 'Maestro']" :rules="[$validations.notEmpty]"></v-combobox>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn dark rounded class="white--text" color="#FF0000" @click="Cancelar">
                            <v-icon small>
                                mdi-cancel
                            </v-icon>
                            Cancelar
                        </v-btn>
                        <v-btn dark rounded class="white--text" color="#43B63B" type="submit">
                            <v-icon small>
                                mdi-checkbox-marked-circle
                            </v-icon>
                            Guardar
                        </v-btn>

                    </v-card-actions>
                </v-card>
                <br>
                <v-row>
                    <v-spacer />
                    <v-btn v-if="btn === 0" @click="CambiarBTN()" dark rounded class="white--text" color="#43B63B">
                        <v-icon small>
                            mdi-account-box
                        </v-icon>
                        Cambiar contraseña
                    </v-btn>
                </v-row>
                <br>
                <v-card ref="con" v-if="btn === 1" outlined class="custom-v-card">
                    <v-card-title class="headline">
                        <b>Ingresa la nueva contraseña</b>
                    </v-card-title>
                    <v-card-text>
                        <v-alert ref="iguales" v-show="data.iguales" color="error" icon="$error">
                            Las contraseñas no coinciden.
                        </v-alert>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="pass.cont" outlined label="Nueva contraseña"
                                    type="password"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="pass.confCont" outlined label="Confirma la contraseña"
                                    type="password"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn dark rounded class="white--text" color="#FF0000" @click="CambiarBTN()">
                            <v-icon small>
                                mdi-cancel
                            </v-icon>
                            Cancelar
                        </v-btn>
                        <v-btn @click="CambiarPass()" dark rounded class="white--text" color="#43B63B">
                            <v-icon small>
                                mdi-checkbox-marked-circle
                            </v-icon>
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-container>

    </v-container>
</template>

<script lang="ts">

// @ts-nocheck
import { clave } from '@/plugins/globals';
const CryptoJS = require("crypto-js");

export default {
    name: 'UsuariosUpdate',
    middleware: 'auth',
    data: () => ({
        load: true,
        usuario: {
            codigo: "",
            nombre: "",
            password: "",
            email: "",
            usuario: "",
            telefono: "",
            admin: 0,
        },
        data: {
            codigo: false,
            nombre: false,
            email: false,
            password: false,
            passconf: false,
            telefono: false,
            rol: false,
            iguales: false,
        },
        pass: {
            cont: "",
            confCont: "",
        },
        btn: 0,
        rol_usuario: "",
        rol: "",
        codigo: "",
        rol_inicial: "",
        url: "",
        editar: false,
        cod: "",
        co: false
    }),

    watch: {
        usuario: {
            deep: true,
            handler() {
                this.data.codigo = false
                this.data.nombre = false
                this.data.email = false
                this.data.password = false
                this.data.passconf = false
                this.data.telefono = false
                this.data.iguales = false
            }
        },
        rol_usuario: {
            deep: true,
            handler() {
                this.data.rol = false
            }
        },
        pass: {
            deep: true,
            handler() {
                this.data.iguales = false
            }
        }
    },

    async beforeMount() {
        try {
            const respons = await this.$axios.get('/login')
            this.rol = respons.data.rol
            this.codigo = respons.data.codigo
            const codi = this.$route.params.id
            if (codi !== this.codigo && this.rol !== 'administrador') {
                this.co = false
                this.load = false
                return
            }
            const url = localStorage.getItem("url")
            if (url !== null) {
                const urlCryp = CryptoJS.AES.decrypt(url, clave);
                this.url = urlCryp.toString(CryptoJS.enc.Utf8);
            }
            const rol = localStorage.getItem("rol")
            if (rol !== null) {
                const rolCryp = CryptoJS.AES.decrypt(rol, clave);
                this.rol_inicial = rolCryp.toString(CryptoJS.enc.Utf8);
                this.rol_usuario = this.rol_inicial
            }
            const codigo = localStorage.getItem("codigo")
            const codigoCryp = CryptoJS.AES.decrypt(codigo, clave);
            this.cod = codigoCryp.toString(CryptoJS.enc.Utf8);
            const response = await this.$axios.get(this.url)
            this.usuario = response.data.data
            if (this.cod === this.usuario.codigo) {
                this.co = true
            }
            this.load = false
        } catch (error) {
        }
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, vue/order-in-components
    beforeRouteLeave(to, from, next) {
        localStorage.removeItem("url");
        localStorage.removeItem("codigo");
        localStorage.removeItem("rol");
        next();
    },

    methods: {
        cancelarEditar() {
            if (this.editar) {
                this.editar = !this.editar
            }
            else {
                window.history.back()
            }
        },
        toggleeditar() {
            if (this.editar) {
                this.guardar()
            }
            else {
                this.editar = !this.editar;
            }
        },
        scrollHaciaAlerta(elemento) {
            if (elemento && elemento.$el) {
                const offset = elemento.$el.offsetTop;
                window.scrollTo({
                    top: offset,
                    behavior: "smooth", // Esto hace que el desplazamiento sea suave
                });
            }
        },
        async guardar() {

            if (this.usuario.codigo === "") {
                this.data.codigo = true
                return
            }
            if (isNaN(Number(this.usuario.codigo))) {
                this.data.codigo = true
                this.$nextTick(() => {
                    this.scrollHaciaAlerta(this.$refs.codigo);
                });
                return
            }
            if (this.usuario.nombre === "") {
                this.data.nombre = true
                this.$nextTick(() => {
                    this.scrollHaciaAlerta(this.$refs.nombre);
                });
                return
            }
            if (this.usuario.email === "") {
                this.data.email = true
                this.$nextTick(() => {
                    this.scrollHaciaAlerta(this.$refs.email);
                });
                return
            }
            // eslint-disable-next-line no-useless-escape
            if (!this.usuario.email.match(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/)) {
                this.data.email = true
                this.$nextTick(() => {
                    this.scrollHaciaAlerta(this.$refs.email);
                });
                return
            }
            if (this.rol_usuario === null || this.rol_usuario === "") {
                this.data.rol = true
                this.$nextTick(() => {
                    this.scrollHaciaAlerta(this.$refs.rol);
                });
                return
            }
            if ((this.usuario.telefono !== "" && this.usuario.telefono.length !== 10) || isNaN(Number(this.usuario.telefono))) {
                this.data.telefono = true
                this.$nextTick(() => {
                    this.scrollHaciaAlerta(this.$refs.telefono);
                });
                return
            }

            try {
                if (this.usuario.codigo === this.codigo && this.rol_inicial !== this.rol_usuario) {
                    return this.$nuxt.$emit('show-snackbar', 'red', "No puedes modificar el rol de tu propio usuario")
                }
            }
            catch (error) {
                return this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
            try {

                if (this.rol_inicial !== this.rol_usuario) {
                    if (this.rol_inicial === "Administrador" && this.rol_usuario === "Maestro") {
                        this.usuario.admin = 0
                    }
                }
                if (this.rol_inicial === "Maestro" && this.rol_usuario === "Administrador") {
                    this.usuario.admin = 1
                }
                await this.$axios.put(this.url, this.usuario)
                this.CambiarPass()
                this.$nuxt.$emit('show-snackbar', 'orange', 'Se actualizaron los datos a exepcion de la contraseña')
                if (this.rol === 'administrador') {
                    window.history.back()
                    return
                }
                if (!this.data.iguales) {
                    location.reload()
                }


            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        },

        Cancelar() {
            window.history.back();
        },

        CambiarBTN() {
            if (this.btn === 0) {
                this.btn = 1
                this.$nextTick(() => {
                    this.scrollHaciaAlerta(this.$refs.con);
                });
            } else {
                this.btn = 0
            }
        },
        async CambiarPass() {
            if (this.editar === 0) {
                return
            }
            if (this.pass.cont === "" && this.pass.confCont === "" && this.rol !== 'administrador') {
                this.CambiarBTN()
                return
            }
            if (this.pass.cont !== this.pass.confCont) {
                this.data.iguales = true
                this.$nextTick(() => {
                    this.scrollHaciaAlerta(this.$refs.iguales);
                });
                return
            }
            try {

                this.usuario.password = this.pass.cont
                const usu = {
                    password: this.pass.cont
                }
                await this.$axios.put(this.url, this.usuario)
                const response = await this.$axios.put(this.url, usu)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)

            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
            this.pass.cont = ""
            this.pass.confCont = ""
            this.btn = 0
            location.reload()
        }
    }
}

</script>
<style>
.custom-v-form {
    margin-top: 0px;
    padding: 20px;
    background-color: #64B5F6;
    box-shadow: 0 0 20px black;
    border-radius: 10px;
}
</style>