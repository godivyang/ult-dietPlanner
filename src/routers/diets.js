// const express = require("express");
import express from "express";
const router = new express.Router();
// const auth = require("../middleware/auth");
// const Diets = require("../models/diets");
import auth from "../middleware/auth.js";
import Diets from "../models/diets.js";
import { getIdFromName, updateLastDietDate } from "./clients.js";
import { getError, getSuccess } from "../middleware/response.js";
import { addSuggestion } from "./suggestions.js";

router.post("/diets", auth, async (req, res) => {
    try {
        const userId = await getIdFromName(req.body.name, req.userId);
        let diet = new Diets({
            diet: req.body.diet,
            userId,
            createdDate: req.body.date,
            author: req.userId
        });
        await diet.save();
        await updateLastDietDate(userId, req.body.date);
        for(const dietItem of req.body.diet) {
            for(const description of dietItem) {
                try {
                    await addSuggestion({description, author: req.userId});
                } catch (e) {}
            }
        }
        res.send({
            success: true,
            data: diet,
            details: {
                code: "SUCCESS",
                message: "Diet saved successfully!"
            }
        });
    } catch (e) {
        console.log(e.message)
        res.status(400).send({
            success: false,
            details: {
                code: "INTERNAL_ERROR",
                message: "Diet was not saved. Please try again."
            }
        });
    }
});

router.get("/diets/:_name/:_count", auth, async (req, res) => {
    try {
        // console.log(req.params)
        const _id = await getIdFromName(req.params._name, req.userId);
        let diets = await Diets.find({ 
                author: req.userId, 
                userId: _id
            })
            .sort({ createdDate: -1 })
            .limit(req.params._count || 5);

        if(diets.length === 0) {
            diets = await Diets.find({
                author: req.userId
            })
            .sort({ createdDate: -1 }).lean();
            if(!diets[0].diet) {
                // this means these diets are not yet updated
                for(let doc of diets) {
                    for(let name of Object.keys(doc.description[0])) {
                        try {
                            let newDiet = new Diets({
                                author: req.userId,
                                createdDate: doc._id.getTimestamp(),
                                userId: await getIdFromName(name, req.userId),
                                diet: doc.description[0][name]
                            });
                            await newDiet.save();
                            await Diets.deleteOne({ _id: doc._id });
                        } catch (e) {}
                    }
                }
                diets = await Diets.find({ 
                        author: req.userId, 
                        userId: _id
                    })
                    .sort({ createdDate: -1 })
                    .limit(req.params._count || 5);
            }
        }
        
        res.send(getSuccess({data: diets, message: "Diets fetched successfully!"}));
    
    } catch (e) {
        res.status(400).send(getError({message: "Client details not found."}));
    }
});

export default router;