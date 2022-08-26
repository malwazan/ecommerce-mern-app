const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors = require("cors");


// init
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB connection successful!"))
    .catch((err) => {
        console.log(err);
    });


app.get("/", async (req, res) => {
    return res.status(200).send("(-_-) I am healthy container ");
});

app.get("/health-check", async (req, res) => {
    return res.status(200).send("(/health-check ._.) I am healthy container");
});

// import routers
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");

// register routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);



// app.listen
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`)
})