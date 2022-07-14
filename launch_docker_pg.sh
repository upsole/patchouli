#!/bin/bash
POSTGRES_READY=1
docker-compose up -d && while [ $POSTGRES_READY -eq 1 ]
do 
  echo "Checking postgres"
  docker-compose exec db pg_isready && POSTGRES_READY=0 && break
  sleep 2
done
yarn prisma migrate deploy && yarn prisma generate
