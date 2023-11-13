const pgPromise = require("pg-promise");
const config = {


    ///Local
/*
     host: "localhost",
    port: "5432",
    database: "inveservicefgl",
    user: "postgres",
    password: "2023" */
   
    host: 'systemcode.ec',
    port: 5432,
    database: 'inveservicefgl',
    user: 'user_inveservice',
    password: 'v@3Whv858' 
    
};

const pgp = pgPromise({});
const db_postgres = pgp(config);

db_postgres
    .connect()
    .then(() => console.log("DB Conectado!"))
    .catch((err) => console.error("Error al conectar con la base de datos", err));

exports.db_postgres = db_postgres;
