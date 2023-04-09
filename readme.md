1.1. run 
boobook/src/main/resources/db/1_create_db.sql
and 
boobook/src/main/resources/db/2_create_insert.sql

1.2. set the properties in the application-docker.properties

1.3. run mvn spring-boot:run -Dspring-boot.run.profiles=docker 

***

2.1. run boobook_messaging/src/main/resources/db/createDB.sql

2.2. set the properties in the application-docker.properties

2.3. run mvn spring-boot:run -Dspring-boot.run.profiles=docker 


***
3.1. in boobook/frontend/js/environment.js
set
HOME_PAGE and MESSAGE_SERVICE_HOME