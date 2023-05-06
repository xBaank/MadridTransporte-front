FROM node:latest AS builder
ENV NODE_ENV production

WORKDIR /app

# Copy app files
COPY . .

# Installs all node packages
RUN npm install --omit=dev --legacy-peer-deps

# Build for production.
RUN npm run build --omit=dev

# Install `serve` to run the application.
RUN npm install -g serve

# Copies everything over to Docker environment

COPY build build

# Run application
#CMD [ "npm", "start" ]
CMD serve -s build
