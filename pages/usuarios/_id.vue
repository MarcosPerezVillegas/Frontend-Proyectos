<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-card>
                <v-card-title>
                    Editar usuario
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="usuario.codigo" label="Código"></v-text-field>
                    <v-text-field v-model="usuario.nombre" label="Nombre"></v-text-field>
                    <v-text-field v-model="usuario.email" label="Email"
                        :rules="[$validations.notEmpty, $validations.isValidEmail]"></v-text-field>
                    <v-combobox v-model="rol_usuario" label="Rol" :items="['Administrador', 'Maestro']"></v-combobox>
                    <v-text-field v-model="usuario.telefono" label="Telefono"></v-text-field>
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
</template>

<script lang="ts">

// @ts-nocheck

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
        url: ""
    }),

    async beforeMount() {
        try {
            const clave = "Encriptar"
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

            let codigo = localStorage.getItem("codigo")
            const codigoCryp = CryptoJS.AES.decrypt(codigo, clave);
            codigo = codigoCryp.toString(CryptoJS.enc.Utf8);

            const response = await this.$axios.get(this.url)
            this.usuario = response.data.data
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', (error as Error).message)
        }
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, vue/order-in-components
    beforeRouteLeave(to, from, next) {
        localStorage.removeItem("url");
        localStorage.removeItem("codigo");
        localStorage.removeItem("rol");
        next();
    },


    beforeDestroy() {
        window.removeEventListener('popstate', this.PopState);
    },

    methods: {
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
                this.$router.push('/Usuarios')
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        },

        PopState() {
            localStorage.removeItem("url");
            localStorage.removeItem("codigo");
            localStorage.removeItem("rol");
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
            this.pass.cont=""
            this.pass.confCont=""
            this.btn=0
        }
    }
}

</script>