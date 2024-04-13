FROM node:20-alpine

WORKDIR /usr/src/app

COPY ./package*.json ./
COPY ./tsconfig.json ./
RUN npm install

EXPOSE 8383
CMD ["npm", "run", "prod"]
