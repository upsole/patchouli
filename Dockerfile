FROM node:alpine

# Set working directory
WORKDIR /usr/src/app

# Copy "package.json" and "package-lock.json" before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package*.json ./
COPY ./yarn.lock ./

# Install dependencies
RUN yarn --ignore-engines

# Copy all files
COPY ./ ./
COPY .env .env

# Build app
# RUN yarn prisma generate
# RUN yarn prisma migrate deploy
RUN yarn build
RUN yarn prisma generate
# # Expose the listening port
# EXPOSE 3000
ENV NODE_ENV production

# Run container as non-root (unprivileged) user
# The "node" user is provided in the Node.js Alpine base image
USER node

# Launch app with PM2
# CMD [ "pm2-runtime", "start", "yarn", "--", "start-migrate" ]
CMD ["yarn", "start-migrate"]
