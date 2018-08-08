FROM node:8
ARG WORKDIR=/home/node
ENV NPM_CONFIG_PREFIX=$WORKDIR/.npm-global
ENV PATH=$PATH:$WORKDIR/.npm-global/bin:$WORKDIR/node_modules/.bin
WORKDIR $WORKDIR
COPY package*.json ./
RUN npm install
COPY elm-package.json ./
COPY webpack.config.js ./
COPY src ./src
COPY tests ./tests
RUN npm run-script build
EXPOSE 5000
USER node
CMD [ "npm", "start" ]

