FROM node:18.16.0 AS builder
ENV NODE_ENV production

WORKDIR /app

COPY . .
ENV NODE_OPTIONS=--max-old-space-size=200
RUN npm install --omit=dev --legacy-peer-deps
RUN npm run build --omit=dev


FROM nginx:1.23.2-alpine AS release

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build  /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]
