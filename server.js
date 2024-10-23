const { Client } = require('pg');

const client = new Client({
    user: 'postgres', // your PostgreSQL username
    host: 'database', // service name from docker-compose.yml
    database: 'your_database_name', // your database name
    password: 'password', // your PostgreSQL password
    port: 5432, // PostgreSQL default port
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));
