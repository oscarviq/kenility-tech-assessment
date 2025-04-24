# --------- STAGE 1: Build the app ---------
FROM node:lts AS builder

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN npm install

# Build the NestJS app
RUN npx nx run backend:build:production --skip-nx-cache

# --------- STAGE 2: Production image ---------
FROM node:lts-slim

# Create app directory
WORKDIR /app

# Copy compiled app from builder stage
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/backend/dist /app/dist

# Mounts a volume for the file uploads
VOLUME ["/app/dist/assets"]

# Expose the port the app listens on
EXPOSE 3000

# Start the NestJS app
CMD ["node", "dist/main.js"]
