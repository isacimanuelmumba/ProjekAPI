const jwt = require("jsonwebtoken");
const config = requre("config");

function auth(req,res,next){

    const token = req.header("x-auth-token");
    if(!token){
            return res.status(401).send("No Token Found");
    }
    let user={};
        try{
             user = jwt.verify(token,config.get("jwtPrivateKey"));
    
        }catch(ex){
            return res.status(400).send("Invalid Token");
    
        }
        console.log(user);
    
        if((new Date().getTime()/1000) - user.iat > 3* 86400){
    
                return res.status(400).send("token expired");
    
        }
        //misal kalau user biasa level nya 1 , admin level 2
        if(user.level<2){//Kalau User bukan admin (level dibawah 2)
    
            return res.status(403).send("You Are not Allow To access this resource");
    
        }
//Sukses
            next();
}

module.exports = auth;