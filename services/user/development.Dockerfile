FROM node:20-alpine

WORKDIR /usr/src/app

COPY ./package*.json ./
COPY ./tsconfig.json ./
RUN npm install

EXPOSE 8484
CMD ["npm", "run", "dev"]
