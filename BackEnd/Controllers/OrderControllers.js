const Order = require('../Model/OrderModel')
const Product = require('../Model/productModel')
const ErrorHandler = require("../Utils/errorHandler");
const catchAsyncError = require("../Middleware/catchAsyncError");

//craete new order

exports.createorder = catchAsyncError(async(req,res,next)=>{

    const {shippingInfo,orderItems,paymentInfo,itemPrice,taxPrice,
        shippingPrice,totalPrice} = req.body;

    
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    });

    res.status(201).json({
        success:true,
        order
    })
})

//getsingleorder

exports.getsingleOrder= catchAsyncError(async(req,res,next)=>{

    const order = await Order.findById(req.param.id).populate("user","name email");

    if(!order){
        return next(new ErrorHandler("order not found ",404));
    }

    res.status(200).json({
        success:true,
        order,
    });
});


//get loogedin user order
exports.myOrder= catchAsyncError(async(req,res,next)=>{

    const orders = await Order.find({user:req.user._id});


    res.status(200).json({
        success:true,
        orders,
    });
})

//getallorder(admin)

exports.getallOrders= catchAsyncError(async(req,res,next)=>{

    const orders = await Order.find();

    let totalamount = 0;

    orders.forEach(order=>{
        totalamount += order.totalPrice;
    })


    res.status(200).json({
        success:true,
        totalamount,
        orders,
    });
})


//updateOrderStatus--Admin
exports.updateOrderStatus= catchAsyncError(async(req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("order not found ",404));
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("you have already delivered this products",400));
    }

    order.orderItems.forEach(async(orderitem)=>{
       await updateStock(orderitem.product,orderitem.quantity);
    })

    order.orderStatus=req.body.status;
    
    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave:false})
    res.status(200).json({
        success:true,
       
    });
})


async function updateStock(id,quantity){

    const product = await Product.findById(id);

    product.stock=product.stock - quantity;

    await product.save({validateBeforeSave:false});

}


//deleteOrder
exports.deleteOrder= catchAsyncError(async(req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("order not found ",404));
    }

    await order.remove()
    res.status(200).json({
        success:true,
        
        
    });
})

