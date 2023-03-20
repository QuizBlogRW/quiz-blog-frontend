FROM node:alpine

ENV PORT 5000

WORKDIR /app

# install dependencies
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install

# Copy source files
COPY . ./

# Start the app
RUN yarn start

# The port that this container will listen to
EXPOSE 5000

# Running the app
CMD [ "yarn", "start" ]