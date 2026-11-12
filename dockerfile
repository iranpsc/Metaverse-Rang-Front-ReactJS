FROM docker.arvancloud.ir/node:20 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm npm ci

COPY . .

RUN npm run build

FROM docker.arvancloud.ir/nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]