const pgPromise = require("pg-promise");
const config = {


    ///Local

    host: "localhost",
    port: "5432",
    database: "inveservice-2",
    user: "postgres",
    password: "root",  
    
   
   /*  host: 'systemcode.ec',
    port: '5432',
    database: 'inveservice',
    user: 'root',
    password: 'Kuka0481@_' */
    
};

const pgp = pgPromise({});
const db_postgres = pgp(config);

db_postgres
    .connect()
    .then(() => console.log("DB Conectado!"))
    .catch((err) => console.error("Error al conectar con la base de datos", err));

exports.db_postgres = db_postgres;
