// const mongoose = require("mongoose");
import mongoose from "mongoose";

const suggestionsSchema = mongoose.Schema({
    description: {
        type: String,
        required: true,
        minLength: 11,
        maxLength: 400
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

// prevent duplicates of same (author + description)
suggestionsSchema.index({ author: 1, description: 1 }, { unique: true });

suggestionsSchema.methods.toJSON = function() {
    let suggestionsObject = this.toObject();
    delete suggestionsObject.author;
    return suggestionsObject;
};

const Suggestions = mongoose.model("Suggestions", suggestionsSchema);

// module.exports = Suggestions;
export default Suggestions;