/**
 * @author Mike Jagd Lykkegaard Winum
 * @description This program is made for a school project. \
 *              The idea behind the project is to create a \
 *              database with mariaDB and make a dynamic   \
 *              website based on data.
 * @see mariaDB
 * @see express
 */

/*
        Needed dependency;
*/
const fs = require('fs');

/*
        Set mariaDB;
*/

const mariaDB = require('mariadb');
let config = require('./config.json')

const pool = mariaDB.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    connectionLimit: config.connectionLimit
});

 /*
        Set express;
 */
const express = require('express');
const app = express();

app.use(express.static("client"));

const port = 8080;

app.get('/', (req,res)=>{
    res.sendFile("./client/index.html");
});

app.get('/products', (req,res)=>{
    pool.getConnection().then(conn=>{
        let sqlQuery = "SELECT * FROM prods";
        conn.query(sqlQuery).then(rows=>{
            delete rows.meta;
            res.send(rows);
        }).catch(err=>{
            console.log(err);
        });
    }).catch(err=>{
        console.log(err);
    })
});

app.listen(port, ()=>{
    console.log(`Listening on: http://localhost:${port}`);
});

