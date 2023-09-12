<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-row>
                <v-spacer />
                <v-btn to="/login" color="red">
                    Cancelar
                </v-btn>
            </v-row>
            <br>
            <v-card>
                <v-card-title>
                    Cambiar Contraseña
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
            </v-card>
            <v-card v-if="btn === 1">
                <v-card-text>
                    <v-text-field v-model="usuario.password" outlined label="Nueva contraseña" type="password" 
                        :rules="[$validations.notEmpty]"></v-text-field>
                    <v-text-field v-model="passconf" outlined label="Confirma la contraseña" type="password"
                        :rules="[$validations.notEmpty]"></v-text-field>
                    <v-text-field v-model="validacion" outlined label="codigo de validación" :rules="[$validations.notEmpty]"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
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
        passconf: "",
        btn: 0,
        usuario: {
            codigo: "",
            nombre: "",
            email: "",
            password: "",
        },
    }),
    beforeMount() {
    },

    methods: {
        async guardar() {
            try {
                if (this.validacion === "" || this.usuario.password === "" || this.passconf === "") {
                    return this.$nuxt.$emit('show-snackbar', 'orange', 'Completa todos los espación obligatorios antes de continuar')
                }
                if(this.usuario.password !== this.passconf){
                    return this.$nuxt.$emit('show-snackbar', 'red', 'Las contraseñas no coinciden')
                }
                if (this.validacion === this.password){
                    try {
                        if(this.maestro === 1){
                            const user = await this.$axios.put(`/Maestros/Cambiar/${this.usuario.codigo}`,  this.usuario)
                            this.$nuxt.$emit('show-snackbar', 'green', "contraseña cambiada")
                        }
                        else{
                            const user = await this.$axios.put(`/Alumnos/Cambiar/${this.usuario.codigo}`,  this.usuario)
                            this.$nuxt.$emit('show-snackbar', 'green', "contraseña cambiada")
                        }
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
                    SecureToken : "fb442f98-2143-4d14-bc28-55d308ed573f",
                    To : this.usuario.email,
                    From : 'martin.lbarboza@alumnos.udg.mx',
                    Subject : "Cambio de contraseña",
                    Body : `Tu codigo de verificación es ${this.password}`
                }).then();
                this.btn = 1
                this.$nuxt.$emit('show-snackbar', 'green', "Correo de recuperacion enviado")
            } catch (error) {
                try{
                    const user = await this.$axios.get(`/Maestros/${this.usuario.codigo}`)
                    this.usuario.email = user.data.data.email
                    this.usuario.nombre = user.data.data.nombre
                    this.maestro = 1
                    console.log(this.usuario.email)
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
                        SecureToken : "fb442f98-2143-4d14-bc28-55d308ed573f",
                        To : this.usuario.email,
                        From : 'martin.lbarboza@alumnos.udg.mx',
                        Subject : "Cambio de contraseña",
                        Body : `Tu codigo de verificación es ${this.password}`
                    }).then();
                    this.btn = 1
                    this.$nuxt.$emit('show-snackbar', 'green', "Correo de recuperacion enviado")
                }  catch (error){
                    this.$nuxt.$emit('show-snackbar', 'red', "Usuario no encontrado")
                }
                
            }
        }
    }
}

</script>