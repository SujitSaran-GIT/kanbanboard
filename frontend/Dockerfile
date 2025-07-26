# Build stage
FROM node:18 as build

WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . .
RUN npm run build

# Serve the build
FROM node:18
RUN npm install -g serve

WORKDIR /app
COPY --from=build /app/dist .
EXPOSE 4173

CMD ["serve", "-s", ".", "-l", "4173"]
