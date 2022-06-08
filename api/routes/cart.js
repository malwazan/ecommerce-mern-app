const router = require("express").Router()
const CryptoJS = require("crypto-js");

const Cart = require("../models/Cart");

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");


// CREATE
router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (err) {
        return res.status(500).json(err);
    }
});


// UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            id=req.params.id, 
            {
                $set: req.body
            },
            {
                new: true
            }
        )

        return res.status(200).json(updatedCart);

    } catch (err) {
        return res.status(500).json(err);
    }
});


// DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(id = req.params.id);
        res.status(200).send("Cart has been deleted!");
    } catch (err) {
        return res.status(500).json(err);
    }
});


// GET USER ID
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        
        res.status(200).send(cart);
    } catch (err) {
        return res.status(500).json(err);
    }
});


// GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;