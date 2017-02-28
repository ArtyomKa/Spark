#6.x lateste version
FROM node:boron   

#RUN apt-get update && apt-get -y upgrade \
#    && apt-get install --no-install-recommends -y -q mysql-client
RUN npm install -g knex

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install

EXPOSE 3000
EXPOSE 5858

ENTRYPOINT ["npm", "run"]

CMD [ "start" ]
