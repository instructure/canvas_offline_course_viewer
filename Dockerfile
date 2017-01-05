FROM instructure/node:6
ENV APP_HOME /usr/src/app
USER root

RUN mkdir -p $APP_HOME
COPY package.json $APP_HOME/
WORKDIR $APP_HOME
RUN npm install

COPY . $APP_HOME
