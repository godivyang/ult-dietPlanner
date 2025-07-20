const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Names = require("../models/names");

router.post("/names", auth, async (req, res) => {
    try {
        let name = new Names({
            ...req.body,
            author: req.userId
        });
        await name.save();
        const names = await Names.find({ 
            author: req.userId 
        });
        res.send(names);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get("/names", auth, async (req, res) => {
    try {
        const names = await Names.find({
            author: req.userId
        });
        res.send(names);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete("/names/:_id", auth, async (req, res) => {
    try {
        await Names.findByIdAndDelete(req.params._id);
        const names = await Names.find({ 
            author: req.userId 
        });
        res.send(names);
    } catch (e) {
        res.status(400).send(e);
    }
})

module.exports = router;