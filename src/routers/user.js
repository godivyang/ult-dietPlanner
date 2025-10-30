// const axios = require("axios");
import axios from "axios";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});

import express from "express";
// const express = require("express");
const router = new express.Router();
import auth from "../middleware/auth.js";
// const auth = require("../middleware/auth");

const tokenOptions = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE == "true",
    sameSite: process.env.COOKIE_SAME_SITE,
    maxAge: 7 * 24 * 60 * 60 * 1000
};

function extractJSON(responseText) {
  try {
    // 1️⃣ First, try direct parse
    return JSON.parse(responseText);
  } catch {
    try {
      // 2️⃣ Extract JSON block if wrapped in markdown or text
      const match = responseText.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
    } catch {
      // ignore and fall through
    }
  }

  // 3️⃣ Fallback: return as plain text if all parsing fails
  return { raw: responseText };
}

router.get("/user/wakeUltUtl", async (req, res) => {
    await axios.create({baseURL: "https://ult-userauth.onrender.com/"}).get("/");
});

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
        res.status(400).send({
            success: false,
            details: {
                code: "AUTH_ERROR",
                message: "Token validation failed!"
            }
        })
    }
});

router.post("/generate/keyword_title", auth, async (req, res) => {
    try {
        async function main() {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: 
`Generate a JSON response with exactly the following format:

{
  "title": "string (short catchy title, max 15 characters)",
  "keyword": "string (keyword for image search)"
}

Post:
${req.body.query}
`
        });
        let parsedResponse = extractJSON(response.text);
        // console.log(parsedResponse);
        res.send({
            success: true,
            data: parsedResponse,
            details: {
                code: "SUCCESS",
                message: "Title generated successfully!"
            }
        });
        };

        main();
    } catch (e) {

    }
});

router.post("/generate/images", auth, async (req, res) => {
    // console.log("user", req.author);
    try {
        console.log(req.body.query);
        const response = await axios.get("https://api.unsplash.com/search/photos", {
            params: {
                page: 1, per_page: 10,
                query: req.body.query,
                client_id: process.env.UNSPLASH_AUTH_KEY
            }
        });
        res.send({
            success: true,
            data: response.data.results.map((img) => img.urls.raw),
            details: {
                code: "SUCCESS",
                message: "Images generated successfully!"
            }
        });
    } catch (e) {
        // console.log(e)
        res.status(400).send({
            success: false,
            details: {
                code: "ERROR",
                message: "Image generation failed!"
            }
        })
    }
});

router.get("/", async (req, res) => {
    res.send("Welcome to Diet Planner app!");
});

// module.exports = router;
export default router;