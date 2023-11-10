const express = require("express");

const { isAuthenticatedUser,authorizeRole } = require("../Middleware/auth");
const { createorder, getsingleOrder, myOrder, getallOrders, updateOrderStatus, deleteOrder } = require("../Controllers/OrderControllers");

const router = express.Router();


router.route("/order/new").post(isAuthenticatedUser,createorder);
router.route("/order/:id").get(isAuthenticatedUser,getsingleOrder);
router.route("/orders/me").get(isAuthenticatedUser,myOrder);
router.route("/admin/orders").get(isAuthenticatedUser,authorizeRole("admin"),getallOrders);
router.route("/admin/order/:id")
    .put(isAuthenticatedUser,authorizeRole("admin"),updateOrderStatus)
    .delete(isAuthenticatedUser,authorizeRole("admin"),deleteOrder);






module.exports=router;