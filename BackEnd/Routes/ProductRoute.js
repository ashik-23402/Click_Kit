const express = require("express");
const { getAllproducts,createProduct, updateProduct, deleteProduct, getSingleProduct } = require("../Controllers/ProductController");

const router = express.Router();

router.route("/products").get(getAllproducts);
router.route("/products/new").post(createProduct);
router.route("/products/:id").put(updateProduct).delete(deleteProduct).get(getSingleProduct);




module.exports=router;