FROM node:latest AS builder
ENV NODE_ENV production
# Add a work directory
RUN npm install -g serve
WORKDIR /app
# Copy app files
COPY . .
RUN npm install --production --legacy-peer-deps
RUN npm run build
ENTRYPOINT ["serve", "-s", "build"]
