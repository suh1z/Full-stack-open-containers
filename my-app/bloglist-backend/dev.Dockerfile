FROM node:20

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm install

COPY . .

CMD ["npm", "run", "dev", "--", "--host"]