<template>
    <v-container>
        <v-form @submit.prevent="guardar" class="custom-v-form">
            <v-row>
                <v-spacer />
                <v-btn dark rounded to="/login" color="#FF0000">
                    <v-icon>
                        mdi-keyboard-backspace
                    </v-icon>
                    Cancelar
                </v-btn>
            </v-row>
            <br>
            <v-card>
                <v-card-title class="headline">
                    <b>Cambiar Contraseña</b>
                </v-card-title>
                <v-card-text>
                <b>Ingresa tu codigo para enviarte un codigo de validacion de cambio de contraseña</b>
                </v-card-text>
                <v-card-text>
                    <v-alert ref="codigo" v-show="data.codigo" color="error" icon="$error">
                        Este campo no puede estar vacio.
                    </v-alert>
                    <v-alert ref="val_cod" v-show="data.val_cod" color="error" icon="$error">
                        Usuario no encontrado.
                    </v-alert>
                    <v-text-field outlined v-model="usuario.codigo" label="Codigo" :rules="[$validations.notEmpty]"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn dark rounded color="#43B63B" @click="envEmail()">
                        <v-icon small>
                            mdi-email
                        </v-icon>
                        enviar correo
                    </v-btn>
                </v-card-actions>
            </v-card>
            <v-card v-if="btn === 1">
                <v-card-text>
                    <v-text-field v-model="usuario.password" outlined label="Nueva contraseña" type="password"
                        :rules="[$validations.notEmpty]"></v-text-field>
                    <v-alert ref="password" v-show="data.password" color="error" icon="$error">
                        Este campo no puede estar vacio.
                    </v-alert>
                    <v-text-field v-model="passconf" outlined label="Confirma la contraseña" type="password"
                        :rules="[$validations.notEmpty]"></v-text-field>
                    <v-alert ref="passconf" v-show="data.passconf" color="error" icon="$error">
                        La campo no puede estar vacio.
                    </v-alert>
                    <v-alert ref="comparacion" v-show="data.comparacion" color="error" icon="$error">
                        Las contraseñas no coinciden.
                    </v-alert>
                    <v-text-field v-model="validacion" outlined label="codigo de validación"
                        :rules="[$validations.notEmpty]"></v-text-field>
                    <v-alert ref="validacion" v-show="data.validacion" color="error" icon="$error">
                        Este campo no puede estar vacio.
                    </v-alert>
                    <v-alert ref="comparacion2" v-show="data.comparacion2" color="error" icon="$error">
                        El codigo de validación es invalido.
                    </v-alert>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn dark rounded type="submit" color="green">
                        <v-icon small>
                            mdi-checkbox-marked-circle
                        </v-icon>
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
</template>

<script lang="ts">

// @ts-nocheck

export default {
    name: 'UsuariosRecovery',
    layout: 'singIn',
    data: () => ({
        maestro: 0,
        validacion: "",
        password: "",
        passconf: "",
        btn: 0,
        usuario: {
            codigo: "",
            nombre: "",
            email: "",
            password: "",
        },
        data: {
            codigo: false,
            password: false,
            passconf: false,
            validacion: false,
            comparacion: false,
            comparacion2: false,
            val_cod: false
        }
    }),

    watch: {
        usuario: {
            deep: true,
            handler() {
                this.data.codigo = false,
                this.data.password = false,
                this.data.passconf = false,
                this.data.validacion = false,
                this.data.comparacion = false,
                this.data.comparacion2 = false,
                this.data.val_cod = false
            }
        },
    },

    beforeMount() {
    },

    methods: {
        async guardar() {
            try {
                if (this.usuario.password === "") {
                    this.data.password = true
                    this.$nextTick(() => {
                        this.$refs.password
                    });
                    return
                }
                if (this.passconf === "") {
                    this.data.passconf = true
                    this.$nextTick(() => {
                        this.$refs.passconf
                    });
                    return
                }
                if (this.usuario.password !== this.passconf) {
                    this.data.comparacion = true
                    this.$nextTick(() => {
                        this.$refs.comparacion
                    });
                    return
                }
                if (this.validacion === "") {
                    this.data.validacion = true
                    this.$nextTick(() => {
                        this.$refs.validacion
                    });
                    return
                }
                if (this.validacion === this.password) {
                    try {
                        if (this.maestro === 1) {
                            const user = await this.$axios.put(`/Maestros/Cambiar/${this.usuario.codigo}`, this.usuario)
                            this.$nuxt.$emit('show-snackbar', 'green', "contraseña cambiada")
                        }
                        else {
                            const user = await this.$axios.put(`/Alumnos/Cambiar/${this.usuario.codigo}`, this.usuario)
                            this.$nuxt.$emit('show-snackbar', 'green', "contraseña cambiada")
                        }
                        this.$router.push('/login')
                    } catch (error) {
                        this.$nuxt.$emit('show-snackbar', 'red', error.message)
                    }
                }
                if (this.validacion !== this.password) {
                    this.data.comparacion2 = true
                    this.$nextTick(() => {
                        this.$refs.comparacion2
                    });
                    return
                }

            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        },
        async envEmail() {
            const Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } }
            try {
                if (this.usuario.codigo === "") {
                    this.data.codigo = true
                    this.$nextTick(() => {
                        this.$refs.codigo
                    });
                    return
                }
                const user = await this.$axios.get(`/Alumnos/${this.usuario.codigo}`)
                this.usuario.email = user.data.data.email
                this.usuario.nombre = user.data.data.nombre
                function genRandonString(length) {
                    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'
                    const charLength = chars.length
                    var result = ""
                    for (var i = 0; i < length; i++) {
                        result += chars.charAt(Math.floor(Math.random() * charLength))
                    }
                    return result
                }
                this.password = genRandonString(12)
                Email.send({
                    SecureToken: "fb442f98-2143-4d14-bc28-55d308ed573f",
                    To: this.usuario.email,
                    From: 'martin.lbarboza@alumnos.udg.mx',
                    Subject: "Cambio de contraseña",
                    Body: `Tu codigo de verificación es ${this.password}`
                }).then();
                this.btn = 1
                this.$nuxt.$emit('show-snackbar', 'green', "Correo de recuperacion enviado")
            } catch (error) {
                try {
                    const user = await this.$axios.get(`/Maestros/${this.usuario.codigo}`)
                    this.usuario.email = user.data.data.email
                    this.usuario.nombre = user.data.data.nombre
                    this.maestro = 1
                    console.log(this.usuario.email)
                    function genRandonString(length) {
                        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'
                        const charLength = chars.length
                        var result = ""
                        for (var i = 0; i < length; i++) {
                            result += chars.charAt(Math.floor(Math.random() * charLength))
                        }
                        return result
                    }
                    this.password = genRandonString(12)
                    Email.send({
                        SecureToken: "fb442f98-2143-4d14-bc28-55d308ed573f",
                        To: this.usuario.email,
                        From: 'martin.lbarboza@alumnos.udg.mx',
                        Subject: "Cambio de contraseña",
                        Body: `Tu codigo de verificación es ${this.password}`
                    }).then();
                    this.btn = 1
                    this.$nuxt.$emit('show-snackbar', 'green', "Correo de recuperacion enviado")
                } catch (error) {
                    this.data.val_cod = true
                    this.$nextTick(() => {
                        this.$refs.val_cod
                    });
                    return
                }

            }
        }
    }
}

</script>

<style>
.custom-v-form {
    margin-top: 0px;
    padding: 20px;
    background-color: #c7eeff;
    box-shadow: 0 0 20px black;
}
</style>