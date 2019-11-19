const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const config= require("config");


const connPoll = mysql.createPool(
    {
        connectionLimit: 10,
        host :"localhost",
        database: "epulsa",
        user:"root",
        password: ""
        //sudah dignti, nama DB local di Komputer isac. epulsa
        //DB bisa diambil di folder document /epulsa.sql 
        //nanti bisa ditambahkan untuk database nya. 
        //trims.
    });

router.post("/register",function(req,res){
    connPoll.getConnection( async function(err,conn){
        if(err) throw err;

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);

        const query = `INSERT into customer Values('${req.body.id_cust}','${req.body.nama_cust}','${req.body.username},'${hashed}')`;
        
        connPoll.query(query,function(err,result){
            conn.release();
            if(err) throw err;
            res.status(201).send({"username":req.body.nama_cust, "":req.body.username});

            //201 SUKSES STATUS
        })


    })

});

router.post("/login",function(req,res){
    connPoll.getConnection(function(err,conn){
        if(err) throw err;


        const query = `SELECT * from user where username = '${req.body.username}'`;

        conn.query(query, async function(err,result){
            conn.release();
            if(err) throw err;
            // res.status(201).send({"username":req.body.username, "level":req.body.level});

            //checking

            if(result.length<=0){
                
                return res.status(400).send("Username atau Password tidak boleh Kosong.");
            }else{

                const user = result[0];
                if(await bcrypt.compare(req.body.password, user["password"]))
                {
                    const token = jwt.sign({
                        "username":user.username,
                        "level" :user.level
                    },config.get("jwtPrivateKey"));
                    //config = library config
                    //jwtPrivateKey namae harus sama dengan custom-environment-variables.json
                    // res.status(201).send(result);
                    return res.status(200).send(token);
                }else{

                    return res.status(400).send("Invalid Username Or Password!");

                }

//buka windows + ketik environment variables

            }

        })


    })



});

module.exports = router;