#!/bin/sh
NODE_ENV=dockerdev knex migrate:latest
npm start