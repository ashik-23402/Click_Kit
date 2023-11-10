const Product = require("../Model/productModel");
const ErrorHandler = require("../Utils/errorHandler");
const catchAsyncError = require("../Middleware/catchAsyncError");
const ApiFeature = require("../Utils/apifeature")


//create product
//admin
exports.createProduct = catchAsyncError(async (req,res,next)=>{

    req.body.user = req.user.id;

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



//create and update review
exports.createProductReview = catchAsyncError(async(req,res,next)=>{
    

    const{rating,comment,productId} = req.body;

    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
        productId
    }

    const product = await Product.findById(productId);

    const isReviewed = await product.reviews.find(rev=>rev.user.toString()===req.user._id.toString());

    if(isReviewed){

        product.reviews.forEach(rev => {
            if(rev.user.toString()===req.user._id.toString()){
                rev.rating= rating;
                rev.comment=comment;
            }
        });

    }else{
        product.reviews.push(review)
        product.numofreviews=product.reviews.length
    }

    let avg = 0;

     product.reviews.forEach(rev=>{
        avg= avg+rev.rating;
    });
    //product.reviews.length;

    product.ratings= avg/product.reviews.length;


    await product.save({validateBeforeSave:false})

    res.status(200).json({
        success:true,

    })




});

//getallreview

exports.getallReview = catchAsyncError(async(req,res,next)=>{

    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews
    })

})


//delete review

exports.deleteReview = catchAsyncError(async(req,res,next)=>{

    const product = await Product.findById(req.query.productId);

    
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }


    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());

    let avg = 0;
    reviews.forEach(rev=>{
    avg= avg+rev.rating;
    });

    const ratings= avg/reviews.length;

    const numofreviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numofreviews
    },{
        new : true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        message:"successfully delete review"
    })

    
})










