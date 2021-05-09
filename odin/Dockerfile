FROM node:13 as dev
WORKDIR /app/odin
COPY package.json /app/odin
RUN npm install

COPY . /app/odin
EXPOSE 9080

CMD ["npm", "run-script", "serve"]

FROM dev as prod
RUN npm run-script build