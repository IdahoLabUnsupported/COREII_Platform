# Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

//Run this command to build out the docker images.
//Docker images are defined in the docker-compose.yml (located in the same directory as this file)
//Docker images are further defined within the Dockerfile located in each subdirectory
//Comment out images in the docker-compose if you want to build specific images only

docker-compose build --no-cache


//This is the sql commmand run to restore from bakup
sqlcmd -S localhost -U sa -P "password123!" -Q "RESTORE DATABASE [PORTAL] FROM DISK = N'/usr/src/app/Portal-2025123-15-2-51.bak' WITH FILE = 1, NOUNLOAD, REPLACE, STATS = 5"