# Stage 1: Build
FROM node:20 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20

WORKDIR /usr/src/app

# Install psql client for migrations
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/db ./db
COPY --from=build /usr/src/app/fonts ./fonts

RUN npm ci --omit=dev

EXPOSE 5000

CMD ["sh", "-c", "npm run migrate && npm run seed && npm run start"]
