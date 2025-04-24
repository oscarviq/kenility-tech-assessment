# --------- STAGE 1: Build the app ---------
FROM node:lts AS builder

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN npm install

# Inject environment variables BEFORE build
ENV VITE_BACKEND_URL=http://localhost:3000
ENV VITE_API_URL=http://localhost:3000/api

# Build the Vue app
RUN npx nx run frontend:build:production --skip-nx-cache

# --------- STAGE 2: Production image ---------
FROM nginx:stable-alpine

# Copy built files from builder
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
