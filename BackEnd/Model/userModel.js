const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const crypto = require("crypto")

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"name must be enter"],
        maxLength:[30,"name can not exceed 30 characters"],
        minLength:[4,"name should be atleast 4 character"]
    },
    email:{
        type:String,
        required:[true,"email must be enter"],
        unique:true,
        validate:[validator.isEmail,"enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"password must be enter"],
        minLength:[8,"pasword length must be 8 "],
        select:false
    },
    avatar:{
        
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordTokenExpired:Date


})


userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        next();
    }


    this.password = await bcrypt.hash(this.password,10)
})

//jwt token

userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}





//compare password
// userSchema.methods.comparePassword = async function(enteredPassword){
// 
    // return await bcrypt.compare(enteredPassword,this.password);
// 
// }
// 
// 


userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
       
    
}

//Generating password reset token
userSchema.methods.getResetpasswordToken= function(){

    //generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //hashing and adding reset password Token
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordTokenExpired= Date.now()+ 15 * 60 * 1000;

    return resetToken;

}






module.exports = mongoose.model("User",userSchema);