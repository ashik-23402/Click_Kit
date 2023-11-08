const ErrorHandler = require("../Utils/errorHandler");
const catchAsyncError = require("../Middleware/catchAsyncError");
const User = require("../Model/userModel")


exports.hello=(req,res,next)=>{

    res.status(200).json({
        name:"lubna"
    })

}

//register user
exports.registerUser = catchAsyncError(async(req,res,next)=>{

    const{name,email,password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilepicurl"
        }
    });

    res.status(201).json({
        success:true,
        user
    })
})