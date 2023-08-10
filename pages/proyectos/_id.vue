<template>
    <v-container>
        <v-form @submit.prevent="guardar">
            <v-card>
                <v-card-title>
                    Editar proyecto
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="proyecto.id" label="ID"></v-text-field>
                    <v-text-field v-model="proyecto.nombre" label="Nombre"></v-text-field>
                    <v-text-field v-model="proyecto.objetivos" label="Objetivos"></v-text-field>
                    <v-text-field v-model="proyecto.fechainicio" label="Fecha de inicio" type="date"></v-text-field>
                    <v-text-field v-model="proyecto.fechafinal" label="Fecha final" type="date"></v-text-field>
                    <v-text-field v-model="proyecto.alumnos" label="Cupos"></v-text-field>
                    <v-combobox v-model="carrera_nombre" label="Carrera" :items="carreras"></v-combobox>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn type="submit">
                        Guardar
                    </v-btn>
                    <v-btn @click="cancelar()" color="red">
                        Cancelar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
</template>

<script lang="ts">

export default {
    name: 'ProyectosUpdate',
    middleware: 'auth',
    data: () => ({
        proyecto: {
            id: "",
            nombre: "",
            objetivos: "",
            fechainicio: "",
            fechafinal: "",
            carrera_clave: "",
            alumnos: "",
        },
        carrera_nombre: "",
        carreras: [],
    }),

    async beforeMount() {
        const id = this.$route.params.id
        
        try {
            const response = await this.$axios.get(`/proyectos/${id}`)
            this.proyecto = response.data.data
            this.carrera_nombre = this.proyecto.Carrera.nombre
            this.cargarCarreras()
        } catch (error) {
            this.$nuxt.$emit('show-snackbar', 'red', error.message)
        }
    },

    methods: {
        async guardar() {
            try {
                const resCar = await this.$axios.get(`/Carreras/Nombre/${this.carrera_nombre}`)
                const Carrera = resCar.data.data
                this.proyecto.carrera_clave=Carrera.clave
                const response = await this.$axios.put(`/proyectos/${this.proyecto.id}`, this.proyecto)
                this.$nuxt.$emit('show-snackbar', 'green', response.data.message)
                this.$router.push('/proyectos')
            } catch (error) {
                this.$nuxt.$emit('show-snackbar', 'red', error.message)
            }
        },
        cancelar() {
            this.$router.push('/proyectos')
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