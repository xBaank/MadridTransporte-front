FROM node:latest AS builder
ENV NODE_ENV production
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
RUN npm install --production --legacy-peer-deps
RUN npm install -g serve
# Copy app files
COPY . .
CMD ["serve", "-s" "build"]
