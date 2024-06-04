FROM node:20-alpine

# Clona el repositorio
RUN git clone https://github.com/EmilCes/effortbackend.git /app

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Instala las dependencias
RUN npm install

# Expone el puerto en el que corre tu aplicación (por defecto 3000)
EXPOSE 3000

# Comando para correr la aplicación
CMD ["npm", "start"]
