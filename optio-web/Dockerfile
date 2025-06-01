FROM node:18 AS build

WORKDIR /optio/optio-web
COPY package*.json ./
RUN ls -ltr
RUN npm install

ARG REACT_APP_SERVER_HOST
ENV REACT_APP_SERVER_HOST=$REACT_APP_SERVER_HOST

RUN ls -ltr
COPY . /optio/optio-web
# Set legacy OpenSSL provider to avoid crypto errors in Webpack
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

FROM nginx:alpine
COPY --from=build /optio/optio-web/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]