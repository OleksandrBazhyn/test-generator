# Use Node.js 20 base image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy all sources
COPY . .

# Build the app (for TypeScript)
RUN npm run build

# Expose default port
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start"]

# (Optional) Healthcheck
# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
#   CMD curl -f http://localhost:5000/api/tests/1 || exit 1
