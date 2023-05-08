FROM node:latest AS builder
ENV NODE_ENV production

WORKDIR /app

COPY . .

RUN npm install --omit=dev
RUN npm run build --omit=dev


FROM nginx:1.23.2-alpine AS release

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build  /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]
