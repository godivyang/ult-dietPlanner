import express from "express";
const router = new express.Router();
import auth from "../middleware/auth.js";
import Clients from "../models/clients.js";
import Names from "../models/names.js";
import { getError, getSuccess } from "../middleware/response.js";

export const getIdFromName = async (name, author) => {
    const client = await Clients.findOne({
        author, name
    });
    return client ? client._id : "";
}

export const updateLastDietDate = async (_id, date) => {
    const client = await Clients.findOne({
        _id
    });
    client.lastDietDate = date;
    await client.save();
    return;
}

router.post("/clients", auth, async (req, res) => {
    try {
        // console.log(req.body)
        let client = new Clients({
            ...req.body,
            author: req.userId
        });
        await client.save();
        res.send(getSuccess({
            message: "Client details saved successfully!"
        }));
    } catch (e) {
        // console.log(e)
        res.status(400).send(getError({
            message: "Client details could not be saved. Please try again."
        }));
    }
});

router.get("/clients", auth, async (req, res) => {
    try {
        let names = await Names.find({author: req.userId});
        if(names.length) {
            for(let obj of names) {
                let client = new Clients({
                    name: obj.name, author: req.userId
                });
                await client.save();
            }
            await Names.deleteMany({author: req.userId});
        }

        const clients = await Clients.find({
            author: req.userId
        });
        res.send(getSuccess({data: clients, message: "Clients fetched successfully!"}));
    } catch (e) {
        res.status(400).send(getError({message: "Client details not found."}));
    }
});

router.delete("/clients/:_id", auth, async (req, res) => {
    try {
        await Clients.findByIdAndDelete(req.params._id);
        res.send(getSuccess({message: "Client deleted successfully!"}));
    } catch (e) {
        res.status(400).send(getError({message: "Client was not deleted."}));
    }
});

router.patch("/clients/:_id", auth, async (req, res) => {
    const allowed = ["name","dob","height","weight","goal","notes","status","lastDietDate"];
    const changing = Object.keys(req.body);
    const flag = changing.every((key) => allowed.includes(key));
    if(!flag) res.status(400).send(getError({message: "Invalid key used!"}));
    try {
        let client = await Clients.findOne({ _id: req.params._id, author: req.userId });
        if(!client) return res.status(404).send(getError({code: "NOT_FOUND", message:"Client not found"}));
        changing.forEach(key => client[key] = req.body[key]);
        await client.save();
        res.send(getSuccess({message: "Client edited successfully!", data: client}));
    } catch (e) {
        res.status(500).send(getError({message: "Transaction edit failed.", detail: e.message}));
    }
});

export default router;