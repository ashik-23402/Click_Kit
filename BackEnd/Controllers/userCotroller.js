const ErrorHandler = require("../Utils/errorHandler");
const catchAsyncError = require("../Middleware/catchAsyncError");
const User = require("../Model/userModel")
const sendToken = require("../Utils/jwtToken")
const sendEmail = require("../Utils/sendEmail")
const crypto = require("crypto");
const { use } = require("../Routes/UserRoute");


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

    sendToken(user,201,res);

})




exports.loginUser = catchAsyncError(async(req,res,next)=>{

    const{email,password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("Please enter eamil and password",400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    sendToken(user,200,res);
   


})

exports.logout = catchAsyncError(async(req,res,next)=>{


    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:"logged out successfully"
    })
})



//forgotpassword
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{

    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User Not found ",404));
    }

    //getResetPasswordToken
    const resetToken =user.getResetpasswordToken();

    await user.save({validateBeforSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is : \n\n ${resetPasswordUrl} \n\n if 
    you have not requested than please ignore it`;

    try {

        await sendEmail({
            email:user.email,
            subject:"Click-KIT password recovery",
            message
        });

        res.status(200).json({
            success:true,
            message:`email sent to ${user.email} successfully`
        })
        
    } catch (error) {

        user.resetPasswordToken=undefined;
        user.resetPasswordTokenExpired=undefined;
        await user.save({validateBeforSave:false});

        return next(new ErrorHandler(error.message,500));
        
    }

})


//resetPassword

exports.resetPassword = catchAsyncError(async(req,res,next)=>{

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpired:{$gt: Date.now()}
    })


    if(!user){
        return next(new ErrorHandler("reset password token invalid or has been expired ",404));
    }

    if(req.body.password != req.body.confirmpassword){
        return next(new ErrorHandler("password doesnt match",400));
    }

    user.password = req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordTokenExpired=undefined;

    await user.save();

    sendToken(user,200,res);
})



exports.getuserDetails = catchAsyncError(async (req,res,next)=>{

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    });
})



exports.updatePassword = catchAsyncError(async (req,res,next)=>{

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldpassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("old Password is incorrect",400));
    }

    if(req.body.newpassword != req.body.confirmpassword){
        return next(new ErrorHandler("Password doesnt matched",400));
    }


    user.password = req.body.newpassword;

    await user.save();

    sendToken(user,200,res);


})




//update user profile

exports.updateProfile = catchAsyncError(async (req,res,next)=>{

    
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    }

    //we will add cloudinary later

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new : true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true
    })


})



//getalluser(admin)
exports.getAllusers = catchAsyncError(async(req,res,next)=>{

    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    })
})

//getsingle(admin)

exports.getauser = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler("user not found",400));
    }



    res.status(200).json({
        success:true,
        user
    })
});



//role update by admin

exports.updateRole = catchAsyncError(async (req,res,next)=>{

    
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

 

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new : true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true
    })


});


//deleteUserbyadmin

exports.deleteUser = catchAsyncError(async (req,res,next)=>{

    
    const user = await User.findById(req.params.id);
    

    if(!user){
        return next(new ErrorHandler("user not found",400));
    }

    await user.remove();

    res.status(200).json({
        success:true,
        message:"user delete sucessfuly"
    })


});


