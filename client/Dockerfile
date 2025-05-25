# Stage 1: Build the React (Vite) app
FROM node:20 AS build

WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the client source code and build
COPY . .
RUN npm run build

# Stage 2: Serve the built static files using a lightweight server
FROM node:20 AS runner

WORKDIR /usr/src/app

# Copy the built app and minimal package files
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./

# Install 'serve' for static file serving
RUN npm install -g serve

# Expose port 5173 (default for Vite preview/serve)
EXPOSE 5173

# Start the static file server
CMD ["serve", "-s", "dist", "-l", "5173"]
