const express = require("express");
const { getAllproducts,createProduct, updateProduct, deleteProduct, getSingleProduct, createProductReview, getallReview, deleteReview } = require("../Controllers/ProductController");
const { isAuthenticatedUser,authorizeRole } = require("../Middleware/auth");

const router = express.Router();

router.route("/products").get(getAllproducts);
router.route("/admin/products/new").post(isAuthenticatedUser,authorizeRole("admin"),createProduct);
router.route("/admin/products/:id")
    .put(isAuthenticatedUser,authorizeRole("admin"),updateProduct)
    .delete(isAuthenticatedUser,authorizeRole("admin"),deleteProduct)

router.route("/products/:id").get(getSingleProduct);

router.route("/review").put(isAuthenticatedUser,createProductReview);

router.route("/reviews").get(getallReview).delete(isAuthenticatedUser,deleteReview);




module.exports=router;