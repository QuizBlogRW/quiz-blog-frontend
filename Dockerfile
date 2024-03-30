FROM node:alpine

ENV PORT 5000

WORKDIR /app

# install dependencies
COPY package*.json ./
COPY package-lock.json ./
RUN npm  install

# Copy source files
COPY . ./

# Start the app
RUN npm  start

# The port that this container will listen to
EXPOSE 5000

# Running the app
CMD [ "yarn", "start" ]