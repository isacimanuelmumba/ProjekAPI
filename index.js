const express = require("express");
const app = express();
const config= require("config");
const user = require("./routes/customer");

console.log(config.get("jwtPrivateKey"));


app.use(express.json());
app.user("/api/customer",customer)

app.listen(3000,function()
{
	console.log("Listening On Port 3000...");	
});