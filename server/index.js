/**
 * @author Mike Jagd Lykkegaard Winum
 * @description This Node.js program is made for a school  \
 *              project. The idea behind the project is to \
 *              create a database with mariaDB and make a  \
 *              dynamic website based on data.
 * @see Node.JS
 * @see mariadb
 * @see express
 * @see body-parser
 */

/*
        Set mariaDB;
*/
const mariaDB = require('mariadb');         //So we can connect to the database
let config = require('./config.json')       //So we can get our settings

const pool = mariaDB.createPool({           //Creates an idle connection to the server. Defined by config
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    connectionLimit: config.connectionLimit
});

 /*
        Set express;
 */
const express = require('express');         //So we can use express functions
const app = express();                      //Activates the express functions
const bodyparser = require('body-parser');  //So we can parse info from the POST method

//app.use(express.cookieParser());            //So we can set cookies for our users - auto login and restricted page
app.use(express.static("client"));          //So we can send .html files
app.use(express.static("images"));          //So we can send images from ./images
app.use(express.json());                    //So we can send error messages and error codes

app.use(bodyparser.json());                 //So we can parse info from the POST method

const port = 8080;                          //The port the server is hosted on

app.get('/', (req,res)=>{                   //Send homepage when site is entered
    res.sendFile("./client/index.html");
});

app.get('/product', (req,res,next)=>{
    let id = req.body.id;
    let options = {
        root: __dirname + '/client/',
        dotfiles: 'allow',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    res.sendFile("./productPage.html", options, err=>{
        if(err){
            next(err);
        }else{
            console.log('send...')
        }
    });
});

app.get('/product/id/:id',(req,res,next)=>{
    console.log('someine')
    let requestedId = req.params.id;

    if(requestedId == undefined || requestedId === null) return

    let sqlQuery = `SELECT * FROM Prods WHERE id="${requestedId}"`;

    pool.getConnection().then(conn=>{
        conn.query(sqlQuery).then(rows=>{
            delete rows.meta;
            res.send(rows[0]);
            console.log("Send prod. information...")
        })
    })
});

app.get('/products', (req,res)=>{           //Send the data for all the products
    console.log('There was a request for Prods...');
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

app.get('/images/:imgName',(req,res, next)=>{   //Send the requested image
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

app.post('/profile/login', (req,res,next)=>{        //Login to our user
    console.log('Someone\'s trying to login...');
    let mainRes = res;
    let sqlQuery = `SELECT * FROM Users WHERE umail="${req.body.email}"`;

    pool.getConnection().then(conn=>{
        conn.query(`SELECT EXISTS(SELECT * FROM Users WHERE umail="${req.body.email}")`).then(res=>{
            delete res.meta;
            let val = Object.values(res[0]);
            if(val[0] != 1){
                mainRes.json({
                    message: "NO_USR",
                    errCode:909
                });
                return conn.end();
            }
            conn.query(sqlQuery).then(res=>{
                delete res.meta;
                if(req.body.password === res[0].upass){
                    console.log("pass matched");
                    mainRes.json({
                        message:"LGD_IN",
                        userName:res[0].uname,
                        userId:res[0].id
                    });
                    return conn.end();
                }else{
                    mainRes.json({
                        message: "WRONG_PWD",
                        errCode: 910
                    });
                    return conn.end();
                }
            }).catch(err=>{
                console.log(err);
                conn.end();
            })
        })
    }).catch(err=>{
        console.log(err);
    })
})

app.post('/profile/signup', (req,res,next)=>{       //Register a new user
    console.log('someone just signed up...'); 
    let mainRes = res;  //Destination of our response. Will get overridden as we get a response from MariaDB database
    let sqlQuery = `INSERT INTO Users (uname, umail, upass) VALUES ("${req.body.username}","${req.body.email}","${req.body.password}")`;

    if(req.body.email === undefined || req.body.username === undefined || req.body.password === undefined){
        return mainRes.json({
            message:"MIS_FIELD",
            errCode: 100
        });
    }

    pool.getConnection().then(conn=>{
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
                        });
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
    });
});

app.post('/profile/addOrder', (req,res,next)=>{
    let mainRes = res;

    if(req.body.uid === null || req.body.uid === undefined || req.body.pid === null || req.body.pid === undefined){
        mainRes.json({
            message:"MIS_FIELD",
            errCode:100
        });
    }

    let sqlQuery = `INSERT INTO Orders (userId, productId) VALUES (${req.body.uid}, ${req.body.pid})`;

    pool.getConnection().then(conn=>{
        conn.query(sqlQuery).then(res=>{
            console.log(res);
            return conn.end();
        }).catch(err=>{
            console.log(err);
            conn.end();
        })
    }).catch(err=>{
        console.log(err);
    })

});

//Start the express service and listen for trafic on the defined port
app.listen(port, ()=>{
    console.log(`Listening on: http://localhost:${port}`);
});