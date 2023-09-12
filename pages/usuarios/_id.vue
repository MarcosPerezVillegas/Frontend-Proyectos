<template>
    <v-container>
        <v-container v-if="rol === 'alumno' || rol === 'maestro'" justify-center align-center>
            <v-card v-if="usuario.codigo === cod">
                <v-card-title>
                    Información del Usuario
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field v-model="usuario.nombre" outlined label="Nombre completo" outlined
                            :readonly="!editar"></v-text-field>

                        <v-text-field v-model="usuario.email" outlined label="Correo electrónico" outlined
                            :readonly="!editar"></v-text-field>

                        <v-text-field v-model="usuario.telefono" outlined label="Número de teléfono" outlined
                            :readonly="!editar"></v-text-field>

                        <v-text-field v-model="usuario.codigo" outlined label="Código de usuario" outlined
                            :readonly="!editar"></v-text-field>

                        <v-text-field v-if="editar" v-model="pass.cont" outlined label="Contraseña" outlined
                            type="password"></v-text-field>

                        <v-text-field v-if="editar" v-model="pass.confCont" outlined label="Confirmar contraseña" outlined
                            type="password"></v-text-field>

                        <v-btn @click="toggleeditar" color="primary">{{ editar ? 'Guardar' : 'Editar' }}</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
            <v-card v-else>
                <v-card-title>Acceso Denegado</v-card-title>
                <v-card-text>
                    <p>No tienes el rol necesario para acceder a esta página.</p>
                </v-card-text>
            </v-card>
        </v-container>
        <v-container v-else>
            <v-form @submit.prevent="guardar">
                <v-card>
                    <v-card-title>
                        Editar usuario
                    </v-card-title>
                    <v-card-text>
                        <v-text-field v-model="usuario.codigo" outlined label="Código"></v-text-field>
                        <v-text-field v-model="usuario.nombre" outlined label="Nombre"></v-text-field>
                        <v-text-field v-model="usuario.email" outlined label="Email"
                            :rules="[$validations.notEmpty, $validations.isValidEmail]"></v-text-field>
                        <v-combobox v-model="rol_usuario" label="Rol" outlined :items="['Administrador', 'Maestro']"></v-combobox>
                        <v-text-field v-model="usuario.telefono" outlined label="Telefono"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="red" @click="Cancelar">
                            Cancelar
                        </v-btn>
                        <v-btn color="green" type="submit">
                            Guardar
                        </v-btn>

                    </v-card-actions>
                </v-card>
                <br>
                <v-row>
                    <v-spacer />
                    <v-btn v-if="btn === 0" @click="CambiarBTN()" color="green">
                        Cambiar contraseña
                    </v-btn>
                </v-row>
                <br>
                <v-card v-if="btn === 1">
                    <v-card-title>
                        Ingresa la nueva contraseña
                    </v-card-title>
                    <v-card-text>
                        <v-text-field v-model="pass.cont" label="Nueva contraseña" type="password"
                            :rules="[$validations.notEmpty]"></v-text-field>
                        <v-text-field v-model="pass.confCont" label="Confirma la contraseña" type="password"
                            :rules="[$validations.notEmpty]"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="red" @click="CambiarBTN()">
                            Cancelar
                        </v-btn>
                        <v-btn @click="CambiarPass()" color="green">
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
        usuario: {
            codigo: "",
            nombre: "",
            password: "",
            email: "",
            usuario: "",
            telefono: "",
            admin: 0,
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
        cod:""
    }),

    async beforeMount() {
        try {
            const respons = await this.$axios.get('/login')
            this.rol = respons.data.rol
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
            console.log(this.usuario.codigo,this.cod)
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
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
        toggleeditar() {
            if(this.editar){
                this.guardar()
            }
            this.editar = !this.editar;
        },
        async guardar() {
            const resRol = await this.$axios.get('/Login')
            this.rol = resRol.data.rol
            this.codigo = resRol.data.codigo
            try {
                if (this.rol_usuario === null) {
                    return this.$nuxt.$emit('show-snackbar', 'red', "No puedes dejar sin rol al usuario")
                }
                if (this.usuario.codigo === this.codigo && this.rol_inicial !== this.rol_usuario) {
                    return this.$nuxt.$emit('show-snackbar', 'red', "No puedes modificar el rol de tu propio usuario")
                }
            }
            catch (error) {
                return this.$nuxt.$emit('show-snackbar', 'red', "Algo salió mal: ", (error as Error).message)
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
                const response = await this.$axios.put(this.url, this.usuario)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                if(this.pass.cont !== "" && this.pass.confCont !== ""){
                    if (this.pass.cont !== this.pass.confCont) {
                    return this.$nuxt.$emit('show-snackbar', 'red', 'Las contraseñas no coinciden')
                }
                this.CambiarPass()
                }
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
            location.reload()
        },

        Cancelar() {
            window.history.back();
        },

        CambiarBTN() {
            this.btn = this.btn === 0 ? 1 : 0;
        },
        async CambiarPass() {
            try {
                if (this.pass.cont === "" || this.pass.confCont === "") {
                    return this.$nuxt.$emit('show-snackbar', 'orange', 'Ingresa las la contraseña correctamente.')
                }
                if (this.pass.cont !== this.pass.confCont) {
                    return this.$nuxt.$emit('show-snackbar', 'red', 'Las contraseñas no coinciden')
                }
                this.usuario.password = this.pass.cont
                const usu = {
                    password: this.pass.cont
                }
                const response = await this.$axios.put(this.url, usu)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
            this.pass.cont = ""
            this.pass.confCont = ""
            this.btn = 0
        }
    }
}

</script>