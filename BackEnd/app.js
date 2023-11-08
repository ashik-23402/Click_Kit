const express = require('express');

const app = express();

const errorMiddleware = require('./Middleware/error')

app.use(express.json())

//route Import
const product = require("./Routes/ProductRoute");
const user = require("./Routes/UserRoute");

app.use("/api/v1",product);
app.use("/api/v1",user);


//middleware
app.use(errorMiddleware)


module.exports=app



