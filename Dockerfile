FROM docker.arvancloud.ir/node:22 AS build
WORKDIR /app
COPY package*.json ./

RUN npm ci

COPY . .
RUN npm run build

FROM docker.arvancloud.ir/nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
