# --- Stage 1: Build the frontend using Node ---
FROM node:18 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy frontend files only
COPY frontend/package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the frontend files
COPY frontend/ .

# Build the production-ready frontend (Vite will output to /dist)
RUN npm run build

# --- Stage 2: Serve the frontend using Nginx ---
FROM nginx:stable-alpine

# Copy built files from previous stage to Nginx public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration if exists, otherwise use default
RUN if [ -f /app/nginx.conf ]; then \
    cp /app/nginx.conf /etc/nginx/conf.d/default.conf; \
    else echo "nginx.conf not found, using default"; \
    fi

# Expose port 80 for serving
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
    