FROM docker.arvancloud.ir/node:23 AS build
WORKDIR /app
COPY package*.json ./

### Temporary solution for offline situation
# RUN npm install
COPY ./node_modules ./node_modules

COPY . .
RUN npm run build

FROM docker.arvancloud.ir/nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]