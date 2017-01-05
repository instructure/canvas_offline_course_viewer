set -ex

docker-compose build
docker-compose run --rm -T test npm run lint
docker-compose run --rm -T test npm run test:coverage
docker-compose up -d

docker cp $(docker-compose ps -q test-data):/usr/src/app/coverage/. coverage
docker-compose stop
docker-compose rm -f
