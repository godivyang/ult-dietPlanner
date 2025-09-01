const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Diets = require("../models/diets");

router.post("/diets", auth, async (req, res) => {
    try {
        let diet = new Diets({
            ...req.body,
            author: req.userId
        });
        await diet.save();
        res.send({
            success: true,
            data: diet,
            details: {
                code: "SUCCESS",
                message: "Diet saved successfully!"
            }
        });
    } catch (e) {
        res.status(400).send({
            success: false,
            details: {
                code: "INTERNAL_ERROR",
                message: "Diet was not saved. Please try again."
            }
        });
    }
});

module.exports = router;