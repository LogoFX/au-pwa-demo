# build stage
FROM node:lts as build-stage

ENV DEBIAN_FRONTEND=noninteractive

#update apt-get
#update apt-get
RUN apt-get update && apt-get install -y \
    apt-utils \
    fonts-liberation \
    libappindicator3-1 \
    libatk-bridge2.0-0 \
    libatspi2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    libgtk2.0-0 \
    libnotify-dev \
    libgconf-2-4 \
    libxss1 \
    libasound2 \
    xvfb \
  && rm -rf /var/lib/apt/lists/*

# install chrome
RUN curl --silent --show-error --location --fail --retry 3 --output /tmp/google-chrome-stable_current_amd64.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
  && ( dpkg -i /tmp/google-chrome-stable_current_amd64.deb ||  apt-get -fy install)  \
  && rm -rf /tmp/google-chrome-stable_current_amd64.deb \
  &&  sed -i 's|HERE/chrome"|HERE/chrome" --disable-setuid-sandbox --no-sandbox|g' \
          "/opt/google/chrome/google-chrome" \
  && google-chrome --version


RUN npm install -g aurelia-cli@^1.2.0


WORKDIR /app

# install dependencies
COPY ./*.json  ./
RUN npm install

COPY config ./config
COPY aurelia_project  ./aurelia_project

COPY types ./types

COPY static ./static

# Copy files in the root folder
COPY *.* ./

# Copy source files
COPY src ./src


# Copy test, unit & e2e
COPY test ./test


# RUN UNIT TESTS
RUN au test

# RUN E2E TESTS
RUN npm run e2e:headless

# build
FROM build-stage as publish-stage
RUN au build --env prod

# production stage
FROM nginx:alpine as production-stage
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html

COPY --from=publish-stage /app/dist/ .




EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
