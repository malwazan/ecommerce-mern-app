const router = require("express").Router()
const CryptoJS = require("crypto-js");

const User = require("../models/User");

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");


// PUT USER
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASSWORD_SECRET
        ).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id=req.params.id, 
            {
                $set: req.body
            },
            {
                new: true
            }
        )

        return res.status(200).json(updatedUser);

    } catch (err) {
        return res.status(500).json(err);
    }
});


// DELETE USER
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(id = req.params.id);
        res.status(200).send("User has been deleted!");
    } catch (err) {
        return res.status(500).json(err);
    }
});


// GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(id = req.params.id);
        
        const {password, ...others} = user._doc;
        res.status(200).send(others);
    } catch (err) {
        return res.status(500).json(err);
    }
});


// GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const query = req.query.new;

        const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
        
        res.status(200).send(users);
    } catch (err) {
        return res.status(500).json(err);
    }
});


// GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            { 
                $match: { 
                    createdAt: { $gte: lastYear } 
                }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                }
            }
        ])

        res.status(200).send(data);
    } catch (err) {
        return res.status(500).json(err);
    }
});



module.exports = router;