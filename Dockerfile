FROM instructure/ruby-node-pg:r2.4n6.x
COPY package.json $APP_HOME/
COPY Gemfile $APP_HOME/
RUN npm install && bundle install
