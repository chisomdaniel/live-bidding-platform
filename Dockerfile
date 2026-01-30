# Stage 1: Build the React frontend
FROM node:20-alpine as frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup the Node.js backend
FROM node:20-alpine
WORKDIR /app

# Copy backend package files and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy backend source code
COPY src/ ./src/

# Copy the built frontend from Stage 1 to the backend's public folder
# We copying to 'public' because that's where src/app.js expects it (../public relative to src/)
COPY --from=frontend-builder /app/client/dist ./public

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
