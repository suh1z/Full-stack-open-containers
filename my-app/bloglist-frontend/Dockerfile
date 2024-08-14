FROM node:20 AS build-stage

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:latest

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]