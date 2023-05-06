FROM node:latest AS builder
ENV NODE_ENV production

WORKDIR /app

COPY . .

RUN npm install --omit=dev --legacy-peer-deps
RUN npm run build --omit=dev
RUN npm install -g serve


FROM builder AS release

WORKDIR /build

COPY --from=builder /app/build .

ENTRYPOINT ["serve", "-s", "."]
