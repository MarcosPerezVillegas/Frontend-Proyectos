<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-card>
                <v-card-title>
                    Crear proyecto
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="proyecto.nombre" label="Nombre"></v-text-field>
                    <v-text-field v-model="proyecto.objetivos" label="Objetivos"></v-text-field>
                    <v-text-field v-model="proyecto.fechainicio" label="Fecha de inicio" type="date"></v-text-field>
                    <v-text-field v-model="proyecto.fechafinal" label="Fecha final" type="date"></v-text-field>
                    <v-text v-if="roles.rol == 'maestro'">Encargado</v-text><br>
                    <v-text v-if="roles.rol == 'maestro'" style="font-size: larger;">{{encargado_nombre}}</v-text>
                    <v-combobox v-if="roles.rol == 'administrador'" v-model="encargado_nombre" label="Encargado" :items="encargados"></v-combobox>
                    <v-text-field v-model="proyecto.alumnos" label="Espacios de registro" type="integer"></v-text-field>
                    <v-combobox v-model="carrera_nombre" label="Carrera" :items="carreras"></v-combobox>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="cancelar()" color="red">
                        Cancelar
                    </v-btn>
                    <v-btn type="submit" color="green">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
</template>

<script lang="ts">


export default {
    name: 'ProyectosCreate',
    middleware: 'auth',

    data: () => ({
        roles: {},
        proyecto: {
            nombre: "",
            objetivos: "",
            fechainicio: "",
            fechafinal: "",
            carrera_clave: "",
            codigo: "",
            alumnos: ""
        },
        encargado_nombre: "",
        carrera_nombre: "",
        carreras: [],
        encargados: [],
    }),

    beforeMount(){
        this.cargarEncargados()
        this.cargarCarreras()
    },


    methods: {
        async guardar() {
            try {
                const resEnca = await this.$axios.get(`/Maestros/Nombre/${this.encargado_nombre}`)
                const Encargado = resEnca.data.data
                this.proyecto.codigo= Encargado.codigo
                const resCar = await this.$axios.get(`/Carreras/Nombre/${this.carrera_nombre}`)
                const Carrera = resCar.data.data
                this.proyecto.carrera_clave=Carrera.clave
                const response = await this.$axios.post('/proyectos', this.proyecto)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                this.$router.push('/proyectos')
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        },
        cancelar() {
            this.$router.push('/proyectos')
        },
        async getEncargados() {
            try{
                const response = await this.$axios.get('/Maestros')
                const responseA = await this.$axios.get(`/Maestros/Admins`)
                const Maestros = response.data.data
                const Admins = responseA.data.data
                console.log(Maestros)
                const usuarios= [...Admins,...Maestros]
                console.log(Admins)
                console.log(usuarios)

                const encargadosItems = usuarios.map(usuario => usuario.nombre)
                return encargadosItems
            }catch(error){
                console.log(error)
                return []

            }
        },
        async getCarreras() {
            try{
                const response = await this.$axios.get('/Carreras')
                const carreras = response.data.data
                const carrerasItems = carreras.map(car => car.nombre)
                return carrerasItems
            }catch(error){
                return []

            }
        },
        async cargarEncargados() {
            try {
                const response = await this.$axios.get('/login')
                this.roles = response.data
                const responseA = await this.$axios.get(`/maestros/${this.roles.codigo}`)
                const usuarios = responseA.data.data
                this.encargado_nombre = usuarios.nombre
                this.encargados = await this.getEncargados();
                console.log(this.encargados)
            }catch(error) {
                console.log(error);
                this.encargados = [];
            }
        },
        async cargarCarreras(){
            try {
                this.carreras = await this.getCarreras();
            }catch(error) {
                console.log(error);
                this.carreras = [];
            }
        }
    }
}

</script>