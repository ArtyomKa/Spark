#6.x lateste version
FROM node:boron   

RUN apt-get update && apt-get -y upgrade \
    && apt-get install --no-install-recommends -y -q mysql-client

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install
RUN npm install -g knex


EXPOSE 3000
#CMD [ "./wait-for-it.sh", "db:3306", "--", "./run_migrations_and_start.sh", "--", "npm", "start" ]

CMD [ "./run_migrations_and_start.sh", "--", "npm", "start" ]

#ENTRYPOINT 
