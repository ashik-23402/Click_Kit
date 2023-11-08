const Product = require("../Model/productModel");
const ErrorHandler = require("../Utils/errorHandler");
const catchAsyncError = require("../Middleware/catchAsyncError");
const ApiFeature = require("../Utils/apifeature")


//create product
//admin
exports.createProduct = catchAsyncError(async (req,res,next)=>{

    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    })

})

//get all products
exports.getAllproducts = catchAsyncError(async (req,res)=>{


     const resultPerPage=2;

     const countProduct = await Product.countDocuments();

    const apifeaturesInstance =new ApiFeature(Product.find(),req.query).search().filter().pagination(resultPerPage);
    
    const products = await apifeaturesInstance.query;

    // console.log(apifeaturesInstance.query);
    

    res.status(200).json({
        success:true,
        products,
        countProduct
        
    })
})


//update products--admin
exports.updateProduct = catchAsyncError(async(req,res,next)=>{

    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,
        {new:true,runValidators:true,useFindAndModify:false})

    res.status(200).json({
        success:true,
        product
    })

}
)
//delete products
exports.deleteProduct = catchAsyncError(async(req,res,next)=>{

    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }

    await Product.deleteOne({ _id: req.params.id });  

    
    res.status(200).json({
        success:true,
        message:"product delete sucessfully"
    })




}
)


exports.getSingleProduct = catchAsyncError(async(req,res,next)=>{

    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404))
    }

    res.status(200).json({
        success:true,
        product
    })


}
)


