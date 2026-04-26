# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy all files
COPY . .

# Build Frontend
RUN cd frontend && npm install && npm run build

# Build Backend
RUN cd backend && npm install && npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy backend dependencies
COPY backend/package*.json ./
RUN npm install --production

# Copy built backend
COPY --from=builder /app/backend/dist ./dist

# Copy built frontend into a 'public' folder accessible by backend
COPY --from=builder /app/frontend/dist ./public

ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

# Start from the backend dist folder
CMD ["node", "dist/index.js"]
