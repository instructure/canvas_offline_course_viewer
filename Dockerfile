FROM instructure/ruby-node-pg:r2.4n6.x
ENV APP_HOME /usr/src/app
USER root

RUN mkdir -p $APP_HOME
COPY package.json $APP_HOME/
COPY Gemfile $APP_HOME/
WORKDIR $APP_HOME
RUN npm install && bundle install

COPY . $APP_HOME
