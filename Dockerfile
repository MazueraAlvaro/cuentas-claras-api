FROM node:19-alpine as build

WORKDIR /cuentas-claras-api

COPY package.json package.json
RUN npm install

COPY . .
RUN npm run build

FROM node:19-alpine

WORKDIR /cuentas-claras-api

ENV NODE_ENV=production
USER node

COPY --from=build --chown=node /cuentas-claras-api/node_modules ./node_modules
COPY --from=build --chown=node /cuentas-claras-api/dist ./dist

EXPOSE 3000

CMD node ./dist/main.js