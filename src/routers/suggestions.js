const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Suggestions = require("../models/suggestions");

router.get("/suggestions", auth, async (req, res) => {
    try {
        const suggestions = await Suggestions.find({
            author: req.userId
        });
        res.send(suggestions);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;