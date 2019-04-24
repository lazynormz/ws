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
const bodyparser = require('body-parser');

app.use(express.static("client"));
app.use(express.static("images"));
app.use(express.json());

app.use(bodyparser.json());

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

            conn.end();
        }).catch(err=>{
            console.log(err);
            conn.end();
        });
    }).catch(err=>{
        console.log(err);
        conn.end();
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
    });
})

app.post('/profile/signup', (req,res,next)=>{
    console.log('someone just signed up...'); 
    let mainRes = res;
    pool.getConnection().then(conn=>{
        let sqlQuery = `INSERT INTO Users (uname, umail, upass) VALUES ("${req.body.username}","${req.body.email}","${req.body.password}")`;
        conn.query(`SELECT EXISTS(SELECT * FROM Users WHERE uname="${req.body.username}")`).then(res=>{
            delete res.meta;
            let val = Object.values(res[0]);
            if(val[0]==1){
                mainRes.json({
                    message:"DUP_NAME",
                    errCode:102
                });
                return conn.end();
            }else{
                conn.query(`SELECT EXISTS(SELECT * FROM Users WHERE umail="${req.body.email}")`).then(res=>{
                    delete res.meta;
                    let val = Object.values(res[0]);
                    if(val[0]==1){
                        mainRes.json({
                            message:"DUP_MAIL",
                            errCode:101
                        });
                        return conn.end();
                    }else{
                        return conn.query(sqlQuery).then(res=>{
                            console.log(res);
                            conn.end();
                        }).catch(err=>{
                            console.log(err);
                            conn.end();
                        })
                    }
                }).catch(err=>{
                    console.log(err);
                    conn.end();
                });
            }
        }).catch(err=>{
            console.log(err);
            res.send(err)
            conn.end();
        });
    }).catch(err=>{
        console.log(err);
        conn.end();
    });
});

app.listen(port, ()=>{
    console.log(`Listening on: http://localhost:${port}`);
});