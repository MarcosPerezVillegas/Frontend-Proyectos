<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-card>
                <v-card-title>
                    Recuperar Contraseña
                </v-card-title>
                <v-card-text>
                    Ingresa tu codigo para enviarte un codigo de validacion de cambio de contraseña
                </v-card-text>
                <v-card-text>
                    <v-text-field v-model="usuario.codigo" label="Codigo" :rules="[$validations.notEmpty]"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="green" @click="envEmail()" >
                        enviar correo
                    </v-btn>
                </v-card-actions>
                <v-card-text>
                    <v-text-field v-model="usuario.password2" label="Nueva contraseña" :rules="[$validations.notEmpty]"></v-text-field>
                    <v-text-field v-model="validacion" label="codigo de validación" :rules="[$validations.notEmpty]"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn to="/login" color="red">
                        Cancelar
                    </v-btn>
                    <v-btn type="submit" color="green">
                        enviar
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
        usuario: {
            codigo: "",
            nombre: "",
            email: "",
            password2: "",
        },
        logMa: {
            email: "jiji@gmail.com",
            password: "WARD"
        }
    }),
    beforeMount() {
    },

    methods: {
        async guardar() {
            try {
                if (this.validacion === "" || this.usuario.password2 === "") {
                    return this.$nuxt.$emit('show-snackbar', 'orange', 'Completa todos los espación obligatorios antes de continuar')
                }
                if (this.validacion === this.password){
                    try {
                        const user = await this.$axios.put(`/Alumnos/Cambiar/${this.usuario.codigo}`,  this.usuario)
                        this.$nuxt.$emit('show-snackbar', 'green', "contraseña cambiada")
                        this.$router.push('/login')
                    } catch(error){
                        this.$nuxt.$emit('show-snackbar', 'red', error.message)
                    }
                }
                if (this.validacion !== this.password){
                    return this.$nuxt.$emit('show-snackbar', 'orange', 'codigo de validacion invalido')
                }
                
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        },
        async envEmail(){
            const Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } }
            try {
                if (this.usuario.codigo === "") {
                    return this.$nuxt.$emit('show-snackbar', 'orange', 'Completa todos los espación obligatorios antes de continuar')
                }
                const user = await this.$axios.get(`/Alumnos/${this.usuario.codigo}`)
                this.usuario.email = user.data.data.email
                this.usuario.nombre = user.data.data.nombre
                function genRandonString(length) {
                    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'
                    const charLength = chars.length
                    var result = ""
                    for ( var i = 0; i < length; i++ ) {
                        result += chars.charAt(Math.floor(Math.random() * charLength))
                    }
                    return result
                }
                this.password = genRandonString(12)
                Email.send({
                    SecureToken : "4b6f9a26-4962-4794-a581-3030f01bf3e3",
                    To : this.usuario.email,
                    From : 'martin.lbarboza@alumnos.udg.mx',
                    Subject : "Recuperar contraseña",
                    Body : `Tu contraseña es ${this.password}`
                }).then();
                this.$nuxt.$emit('show-snackbar', 'green', "Correo de recuperacion enviado")
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        }
    }
}

</script>