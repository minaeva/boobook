mvn clean verify -P sonar \
-Dsonar.host.url=https://sonarcloud.io \
-Dsonar.organization=minaeva \
-Dsonar.login=bbc3ea0958857e945d7f3b0abfc9cf45ec8e89a1 -DskipTests

•••
DOCKER instruction:

cd boobook-reader-service/local
docker-compose up
