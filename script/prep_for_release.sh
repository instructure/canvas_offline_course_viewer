set -ex

npm test
npm run i18n:check

npm run clean

npm run i18n:export
npm run webpack:prod

git add -f dist

set +x
echo "---------------------------------------------"
echo " don't forget to bump the version and commit "
echo "---------------------------------------------"
