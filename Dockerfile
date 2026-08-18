# Multi-stage Docker build for production
# Stage 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Stage 2: Production stage
FROM node:18-alpine

WORKDIR /app

# Install simple HTTP server
RUN npm install -g http-server

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy public assets if any
COPY --from=builder /app/.env.production ./.env.production 2>/dev/null || true

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of app files
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

# Security labels
LABEL security.scan="true" \
      security.scan.date="2026-05-25"

# Start server
CMD ["http-server", "dist", "-p", "3000", "-c-1", "-z"]
