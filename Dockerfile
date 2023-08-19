# Utiliza una imagen base adecuada para Node.js
FROM node:14

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de tu proyecto de Yarn a la imagen
COPY . .

ENV CI=true
# Instala las dependencias
RUN yarn install

# Comando para construir el proyecto
RUN yarn build

# Expone el puerto en el que se ejecutará el proyecto
EXPOSE 3000

# Comando para ejecutar el servidor de desarrollo (puedes ajustar esto según tus necesidades)
CMD ["yarn", "dev"]
