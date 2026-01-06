#####################################
# BUILD STAGE
#####################################
FROM node:20 AS builder
WORKDIR /app

# Copiar archivos para instalar dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluye devDependencies)
RUN npm install --legacy-peer-deps

# Copiar el resto del proyecto
COPY . .

# ---- VARIABLES DE ENTORNO PARA EL BUILD ----
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_PORT

# Exportarlas al build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_PORT=$NEXT_PUBLIC_PORT

# Hacer el build
RUN npm run build


#####################################
# RUNTIME STAGE
#####################################
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copiar solo lo necesario para ejecutar
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["npm", "start"]
