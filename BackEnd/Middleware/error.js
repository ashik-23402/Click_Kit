const ErrorHandler = require("../Utils/errorHandler");

module.exports = (err,req,res,next)=>{

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    //mongodberror
    if(err.name === "CastError"){
        const message = `resource not found.invalid ${err.path}`;
        err = new ErrorHandler(message,400)
    }

    if(err.code === 1000){
        const message = `Duplicate ${object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message,400);
    }

    //jwt error

    if(err.name === "JsonWebTokenError"){
        const message = `Json webtoken is invalid ,try again`;
        err = new ErrorHandler(message,400)
    }

    //jwt expire error
    if(err.name === "TokenExpiredError"){
        const message = `Json webtoken is expired ,try again`;
        err = new ErrorHandler(message,400)
    }


    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })

}