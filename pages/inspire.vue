<template>
  <v-app>
    <v-card>
      <div class="inicio">
        <h1>Bienvenido a la plataforma de proyectos de titulación</h1>
        <br>
        <p style="text-align:justify;">
          ¡Bienvenidos a nuestra plataforma de proyectos de titulación para alumnos universitarios! Aquí encontrarás una
          oportunidad única para participar en proyectos de investigación y desarrollo propuestos por nuestros destacados
          maestros. Nuestra página está diseñada para brindarte una experiencia enriquecedora, donde podrás aplicar tus
          conocimientos y habilidades en un entorno práctico y relevante para tu área de estudio.
        </p>
        <p style="text-align:justify;">El propósito principal de nuestra plataforma es fomentar tu participación activa en
          proyectos de titulación. Queremos que te involucres en proyectos emocionantes y desafiantes que te permitan
          crecer
          académica y profesionalmente. Al unirte a uno de estos proyectos, podrás adquirir experiencia práctica,
          desarrollar
          habilidades clave y establecer relaciones con maestros y compañeros de estudio que compartirán tu pasión por el
          aprendizaje y la investigación.
        </p>
        <p style="text-align:justify;">Utilizar nuestra plataforma es muy sencillo. En la página principal, encontrarás un
          formulario de registro donde podrás ingresar tus datos personales, como tu nombre y carrera. Además, tendrás
          acceso
          a una lista de proyectos de titulación propuestos por nuestros maestros. Explora esta lista y selecciona el
          proyecto
          que más te llame la atención y se ajuste a tus intereses y objetivos académicos. Una vez que hayas elegido un
          proyecto, completa el formulario y envíalo para formalizar tu participación.
        </p>
        <p style="text-align:justify;">Una vez que te hayas registrado en un proyecto, recibirás una confirmación de tu
          inscripción exitosa. También tendrás acceso a información adicional, como los plazos y los maestros responsables
          del
          proyecto. A partir de ahí, podrás comenzar a colaborar con el maestro y otros alumnos involucrados en el
          proyecto,
          aprovechando esta oportunidad para expandir tus conocimientos, presentar ideas innovadoras y contribuir
          activamente
          al éxito del proyecto de titulación.
        </p>
        <p style="text-align:justify;">En resumen, nuestra plataforma de proyectos de titulación es tu puerta de entrada a
          una
          experiencia académica enriquecedora. Te invitamos a explorar los proyectos disponibles, registrarte en aquel que
          despierte tu interés y sumergirte en un entorno de aprendizaje colaborativo. Aprovecha esta oportunidad para
          crecer
          profesionalmente, establecer conexiones valiosas y hacer una contribución significativa a tu campo de estudio.
          ¡Te
          deseamos mucho éxito en tu trayectoria de proyectos de titulación!
        </p>
      </div>
      <v-card-actions>
        <v-btn type="submit" color="primary" block to="/Login">Iniciar Sección</v-btn>
      </v-card-actions>
    </v-card>
  </v-app>
</template>

<script lang="ts">

export default {

  name: 'Bienvenido',


  data() {
    return {

    };
  },
  methods: {

  }
};
</script>

<style scoped>
.inicio {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}</style>