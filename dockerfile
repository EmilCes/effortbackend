FROM node:20-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json al directorio /app de la imagen
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia todos los archivos a la imagen
COPY . .

# Expone el puerto en el que corre tu aplicación (por defecto 3000)
EXPOSE 3000

# Comando para correr la aplicación
CMD npm start