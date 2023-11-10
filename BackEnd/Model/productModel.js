const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter product name"],
        trim: true
    },
    description:{
        type:String,
        required:[true,"please give description of product"]
    },
    price:{
        type:Number,
        required:[true,"please give price of product"],
        maxLength:[8,"price cannot exceed 8 digit"]

    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,"category required for products"]
    },
    stock:{
        type:Number,
        required:[true,"stock require for product"],
        maxLength:[4,"stock cannot exceed 8 digit"],
        default:1
    },
    numofreviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true

            }
        }
    ],

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});


module.exports=mongoose.model("Product",productSchema)