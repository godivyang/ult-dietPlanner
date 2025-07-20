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
        res.send(diet);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;