const router = require("express").Router()
const CryptoJS = require("crypto-js");

const Product = require("../models/Product");

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");


// CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        return res.status(500).json(err);
    }
});


// UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id=req.params.id, 
            {
                $set: req.body
            },
            {
                new: true
            }
        )

        return res.status(200).json(updatedProduct);

    } catch (err) {
        return res.status(500).json(err);
    }
});


// DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(id = req.params.id);
        res.status(200).send("Product has been deleted!");
    } catch (err) {
        return res.status(500).json(err);
    }
});


// GET BY ID
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(id = req.params.id);
        
        res.status(200).send(product);
    } catch (err) {
        return res.status(500).json(err);
    }
});


// GET ALL
router.get("/", async (req, res) => {
    try {
        const qNew = req.query.new;
        const qCategory = req.query.category;

        let products;

        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        } else if (qCategory) {
            products = await Product.find(
                { 
                    categories: { $in: [qCategory] } 
                }
            );
        } else {
            products = await Product.find();
        }
        
        res.status(200).send(products);
    } catch (err) {
        return res.status(500).json(err);
    }
});



module.exports = router;