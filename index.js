const express = require("express");
require("dotenv").config();
const userRouter = require("./src/routers/user");
const suggestionsRouter = require("./src/routers/suggestions");
const dietsRouter = require("./src/routers/diets");
const namesRouter = require("./src/routers/names");

const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./src/db/mongoose");

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

app.use(express.json());

app.use(cookieParser());

app.use(userRouter);
app.use(suggestionsRouter);
app.use(dietsRouter);
app.use(namesRouter);

app.listen(port, () => {
    console.log("Diet planner server is up on port", port);
});