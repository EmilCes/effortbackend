FROM node:21

# Instala git
RUN apt-get update && apt-get install -y git

# Clona el repositorio
RUN git clone https://github.com/tu-usuario/tu-repositorio.git /app

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo .env al contenedor (asegúrate de tener el archivo .env en la misma carpeta que el Dockerfile)
COPY .env ./

# Instala las dependencias
RUN npm install

# Expone el puerto en el que corre tu aplicación (por defecto 3000)
EXPOSE 3000

# Comando para correr la aplicación
CMD ["npm", "start"]
