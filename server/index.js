/**
 * @author Mike Jagd Lykkegaard Winum
 * @description This Node.js program is made for a school  \
 *              project. The idea behind the project is to \
 *              create a database with mariaDB and make a  \
 *              dynamic website based on data.
 * @see Node.JS
 * @see mariadb
 * @see express
 */

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
app.use(express.static("images"));

const port = 8080;

app.get('/', (req,res)=>{
    res.sendFile("./client/index.html");
});

app.get('/products', (req,res)=>{
    console.log('There was a request for %Prods%...');
    pool.getConnection().then(conn=>{
        let sqlQuery = "SELECT * FROM Prods";
        conn.query(sqlQuery).then(rows=>{
            delete rows.meta;   //Can't use this data for anything
            res.send(rows);
        }).catch(err=>{
            console.log(err);
        });
    }).catch(err=>{
        console.log(err);
    });
});

app.get('/images/:imgName',(req,res, next)=>{
    console.log('There was a request for an image...');
    let imageName= req.params.imgName;

    let options = {
        root: __dirname + '/images/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    if(imageName === null) imageName = "default.png";

    res.sendFile(imageName, options , (err)=>{
        if(err) next(err);
        else console.log('send image...');
    })
})

app.listen(port, ()=>{
    console.log(`Listening on: http://localhost:${port}`);
});