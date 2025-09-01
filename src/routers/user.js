const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");

const tokenOptions = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE == "true",
    sameSite: process.env.COOKIE_SAME_SITE,
    maxAge: 7 * 24 * 60 * 60 * 1000
};

router.post("/user/me", auth, async (req, res) => {
    // console.log("user", req.author);
    try {
        res.cookie("token", req.token, tokenOptions);
        res.send({
            success: true,
            data: req.userName,
            details: {
                code: "SUCCESS",
                message: "Token validated successfully!"
            }
        });
    } catch (e) {
        console.log(e)
        res.status(400).send({
            success: false,
            details: {
                code: "AUTH_ERROR",
                message: "Token validation failed!"
            }
        })
    }
});

router.get("/", async (req, res) => {
    res.send("Welcome to Diet Planner app!");
});

module.exports = router;