var router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const User = require("../models/User");


// REGISTER
router.post("/register", async (req, res) => {


    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString(),
    });
    
    try {
        const savedUser = await newUser.save();
        res.status(201).send(savedUser);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});


// LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        // !user && res.status(401).json("Wrong Credentials!");
        if (!user) {
            res.status(401).json("Wrong Credentails!");
            return;
        }
        
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        // originalPassword !== req.body.password && res.status(401).json("Wrong Credentials!");
        if (originalPassword !== req.body.password) {
            res.status(401).json("Wrong Credentials!");
            return;
        }
        

        // add jwt accesstoken to response object
        const accessToken = jwt.sign(
            {
                id: user._id, isAdmin: user.isAdmin
            }, 
            process.env.JWT_SECRET,
            {
                expiresIn: "3d"
            }
        );

        // remove password field from response json
        const { password, ...others } = user._doc;

        res.status(200).json({...others, accessToken});
        
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});



module.exports = router;