FROM node:alpine
WORKDIR /app
COPY . ./
COPY package.json package-lock.json ./
RUN npm install
EXPOSE 4000
CMD [ "npm","start" ]