
const app = require("./app");

const dotenv = require('dotenv');

const connectDataBase = require('./Config/Database');


//config

dotenv.config({path:"BackEnd/config/config.env"})

//connecting to database 
connectDataBase();




app.listen(process.env.PORT,()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`)
})
