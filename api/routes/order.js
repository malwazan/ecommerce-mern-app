const router = require("express").Router()
const CryptoJS = require("crypto-js");

const Order = require("../models/Order");

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");


// CREATE
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (err) {
        return res.status(500).json(err);
    }
});


// UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            id=req.params.id, 
            {
                $set: req.body
            },
            {
                new: true
            }
        )

        return res.status(200).json(updatedOrder);

    } catch (err) {
        return res.status(500).json(err);
    }
});


// DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(id = req.params.id);
        res.status(200).send("Order has been deleted!");
    } catch (err) {
        return res.status(500).json(err);
    }
});


// GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        
        res.status(200).send(orders);
    } catch (err) {
        return res.status(500).json(err);
    }
});


// GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});


// GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    try {
        const date = new Date();                                                        // current_month
        const lastMonth = new Date(date.setMonth(date.getMonth() - 1));                 // current_month - 1
        const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));  // current_month - 2

        const income = await Order.aggregate([
            {
                $match: { createdAt: { $gte: previousMonth } }
            },
            {
                $project: { 
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            }
        ]);

        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;