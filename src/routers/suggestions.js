import express from "express";
const router = new express.Router();
import auth from "../middleware/auth.js";
import Suggestions from "../models/suggestions.js";

router.get("/suggestions", auth, async (req, res) => {
    try {
        const suggestions = await Suggestions.find({
            author: req.userId
        });
        res.send({
            success: true,
            data: suggestions,
            details: {
                code: "SUCCESS",
                message: "Suggestions fetched successfully!"
            }
        });
    } catch (e) {
        res.status(400).send({
            success: false,
            details: {
                code: "NOT_FOUND",
                message: "Suggestions fetch failed. Please try again."
            }
        });
    }
});

export default router;