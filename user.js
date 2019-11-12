const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");



database :"wsifm20191_dosen",
user: "root",
password: ""
});


router.post(/"register",function(req,res){
    pool.getConnection(async function(err,com){
        if(err) throw err;

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);

        const query = 'INSERT into user Values('${req.body.username}','${hashed}',${req.body.level})';

        conn.query(query,function(err,result){
            conn.release();
            if(err) throw err;
            res.status(201).send({"username":req.body.username, "level":req.body.level});


        })


    })

});

router.post("/login",function(req,res){
    pool.getConnection(async function(err,com){
        if(err) throw err;


        const query = `SELECT * from user where username = '${req.body.username}'`;

        conn.query(query,function(err,result){
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

                    res.status(201).send(result);

                }else{

                    return res.status(400).send("Invalid Username Or Password!");

                }



            }

        })


    })



});
