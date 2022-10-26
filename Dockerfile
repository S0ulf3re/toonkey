FROM node:18-alpine
ENV YARN_CHECKSUM_BEHAVIOR=update
ARG NODE_ENV=production
WORKDIR /calckey

# Copy Files
COPY . ./

# Install Dependencies
RUN apk update
RUN apk add git ffmpeg tini alpine-sdk

# Configure corepack and yarn
RUN corepack enable
RUN yarn set version berry
RUN yarn plugin import workspace-tools

# Install Dependencies
RUN yarn install
RUN yarn build

# Remove git files
RUN rm -rf .git

ENTRYPOINT [ "/sbin/tini", "--" ]
CMD [ "yarn", "run", "migrateandstart" ]
