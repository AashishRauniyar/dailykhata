# Multi-stage build for production
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code and prisma schema
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install curl for health checks
RUN apk --no-cache add curl

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy prisma schema for migrations
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy the source utils for database initialization (needed for seeding)
COPY --from=builder /app/src/utils ./src/utils
COPY --from=builder /app/src/config ./src/config

# Generate Prisma client in production environment
RUN npx prisma generate

# Create a health check script
RUN echo '#!/bin/sh' > /app/health-check.sh && \
    echo 'PORT=${PORT:-8001}' >> /app/health-check.sh && \
    echo 'curl -f http://localhost:$PORT/api/health || exit 1' >> /app/health-check.sh && \
    chmod +x /app/health-check.sh

# Create a script to handle database initialization
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "🚀 Starting Financial Tracker Backend..."' >> /app/start.sh && \
    echo 'echo "📊 Using PORT: ${PORT:-8001}"' >> /app/start.sh && \
    echo 'echo "⏳ Waiting for database to be ready..."' >> /app/start.sh && \
    echo 'while ! npx prisma db push --accept-data-loss > /dev/null 2>&1; do' >> /app/start.sh && \
    echo '  echo "⏳ Database not ready yet, waiting 5 seconds..."' >> /app/start.sh && \
    echo '  sleep 5' >> /app/start.sh && \
    echo 'done' >> /app/start.sh && \
    echo 'echo "✅ Database connection established"' >> /app/start.sh && \
    echo 'echo "🔧 Running database migrations..."' >> /app/start.sh && \
    echo 'npx prisma db push --accept-data-loss' >> /app/start.sh && \
    echo 'echo "🌱 Seeding database with default users..."' >> /app/start.sh && \
    echo 'npm run init || echo "⚠️  Database already initialized or seeding failed"' >> /app/start.sh && \
    echo 'echo "🎉 Database initialization completed!"' >> /app/start.sh && \
    echo 'echo "🚀 Starting the application server..."' >> /app/start.sh && \
    echo 'npm start' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose port 8001 (new default)
EXPOSE 8001

# Health check using the dynamic health check script
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD /app/health-check.sh

# Start the application with initialization
CMD ["/app/start.sh"] 