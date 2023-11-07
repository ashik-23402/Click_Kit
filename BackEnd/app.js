const express = require('express');

const app = express();

const errorMiddleware = require('./Middleware/error')

app.use(express.json())

//route Import
const product = require("./Routes/ProductRoute")
app.use("/api/v1",product)

//middleware
app.use(errorMiddleware)


module.exports=app



