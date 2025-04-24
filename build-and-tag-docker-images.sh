APP_VERSION=$(git describe --tags --always)
docker compose -p kenility-oscar-viquez build --no-cache

docker tag kenility-oscar-viquez-api oviquez/kenility-api:$APP_VERSION
docker tag kenility-oscar-viquez-frontend oviquez/kenility-frontend:$APP_VERSION
