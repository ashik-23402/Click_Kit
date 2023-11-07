
const app = require("./app");

const dotenv = require('dotenv');

const connectDataBase = require('./Config/Database');



//Handling uncaught exception

process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`)
    console.log(`shutting down the server due to uncaught exception`);
    process.exit(1);
})



//config

dotenv.config({path:"BackEnd/config/config.env"})

//connecting to database 
connectDataBase();




const server = app.listen(process.env.PORT,()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`)
})


//UNHANDLED PROMIS REJECTION
process.on("unhandledRejection",err=>{
    console.log(`error : ${err.message}`);
    console.log(`shutting down the server due to unhandle promis rejection`);
    server.close(()=>{
        process.exit(1)
    });
})
