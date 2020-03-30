const knex   = require('knex');
const configuration = require('../../knexfile');

const config = process.env.NODE_ENV == 'test'? configuration.test : configuration.production;

const database = knex( config );

module.exports = database;