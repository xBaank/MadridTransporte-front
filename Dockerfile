FROM node:latest AS builder
ENV NODE_ENV production
# Add a work directory
RUN npm install -g serve
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
RUN npm install --production --legacy-peer-deps
RUN npm run build
# Copy app files
COPY . .
ENTRYPOINT ["serve", "-s", "build"]
