const express = require('express');

const app = express();
const cookieParser = require('cookie-parser');

const errorMiddleware = require('./Middleware/error')

app.use(express.json())
app.use(cookieParser())

//route Import
const product = require("./Routes/ProductRoute");
const user = require("./Routes/UserRoute");
const order = require("./Routes/OrderRoute");

app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);


//middleware
app.use(errorMiddleware)


module.exports=app



