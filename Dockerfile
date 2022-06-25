FROM node:lts-alpine as frontendBuilder
WORKDIR /workspace

ENV PUBLIC_URL=/app

COPY ./package.json ./tsconfig.json ./yarn.lock ./

RUN yarn install

ENV NODE_ENV=production

COPY ./public ./public
COPY ./src ./src

RUN yarn build

FROM nginx:alpine
WORKDIR /

COPY --from=frontendBuilder \
    /workspace/build \
    /usr/share/nginx/html/app

COPY ./nginx.conf /etc/nginx/conf.d/default.conf.template
CMD /bin/sh -c "envsubst '\$PORT' '\$GRAPHQL_API_URL' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'
