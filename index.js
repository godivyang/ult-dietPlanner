import "dotenv/config";
// dotenv.config();
import express, { json } from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import "./src/db/mongoose.js";

import userRouter from "./src/routers/user.js";
import suggestionsRouter from "./src/routers/suggestions.js";
import dietsRouter from "./src/routers/diets.js";
import namesRouter from "./src/routers/names.js";

const app = express();
const port = process.env.PORT || 4002;

const allowedOrigin = process.env.DIET_PLANNER_FRONTEND_URL;
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or Postman)
        // console.log(origin);
        if(!origin) return callback(null, true);

        if(allowedOrigin === origin) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(json());

app.use(cookieParser());

app.use(userRouter);
app.use(suggestionsRouter);
app.use(dietsRouter);
app.use(namesRouter);

app.listen(port, () => {
    console.log("Diet planner server is up on port", port);
});