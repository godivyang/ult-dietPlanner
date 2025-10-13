// const express = require("express");
import express from "express";
const router = new express.Router();
// const auth = require("../middleware/auth");
// const Names = require("../models/names");.
import auth from "../middleware/auth.js";
import Names from "../models/names.js";

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
        res.send({
            success: true,
            data: names,
            details: {
                code: "SUCCESS",
                message: "Name saved successfully!"
            }
        });
    } catch (e) {
        res.status(400).send({
            success: false,
            details: {
                code: "NOT_FOUND",
                message: "Name could not be saved. Please try again."
            }
        });
    }
});

router.get("/names", auth, async (req, res) => {
    try {
        const names = await Names.find({
            author: req.userId
        });
        res.send({
            success: true,
            data: names,
            details: {
                code: "SUCCESS",
                message: "Names fetched successfully!"
            }
        });
    } catch (e) {
        res.status(400).send({
            success: false,
            details: {
                code: "NOT_FOUND",
                message: "Names not found. Please try again."
            }
        });
    }
});

router.delete("/names/:_id", auth, async (req, res) => {
    try {
        await Names.findByIdAndDelete(req.params._id);
        const names = await Names.find({ 
            author: req.userId 
        });
        res.send({
            success: true,
            data: names,
            details: {
                code: "SUCCESS",
                message: "Name deleted successfully!"
            }
        });
    } catch (e) {
        res.status(400).send({
            success: false,
            details: {
                code: "NOT_FOUND",
                message: "Name was not deleted. Please try again."
            }
        });
    }
})

// module.exports = router;
export default router;