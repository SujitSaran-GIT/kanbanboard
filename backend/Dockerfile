FROM node:18.9.1

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8001

CMD [ "npm","run","backend" ]