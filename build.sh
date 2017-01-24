set -ex

docker-compose build
docker-compose run --rm test npm run lint
docker-compose run --rm test npm run test:coverage

# i18nliner always returns success, so grep output for failures
docker-compose run --rm test npm run i18n:check | tee check.txt
if egrep '\b0 failure' check.txt ; then
  true
else
  if egrep '\d+ failure' check.txt ; then
    false
  fi
fi

docker-compose up -d

docker cp $(docker-compose ps -q test-data):/usr/src/app/coverage/. coverage
docker-compose stop
docker-compose rm -f
