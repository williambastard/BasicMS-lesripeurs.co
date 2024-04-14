FROM node:20-alpine

WORKDIR /usr/src/app

COPY ./package*.json ./
COPY ./tsconfig.json ./
RUN apk --no-cache add git
RUN npm install

EXPOSE 80
CMD ["npm", "run", "dev"]
