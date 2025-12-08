// const mongoose = require("mongoose");
import mongoose from "mongoose";

const suggestionsSchema = mongoose.Schema({
    description: {
        type: String,
        required: true,
        maxLength: 1000,
        minLength: 15
    },
    signature: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

// prevent duplicates of same (author + description)
suggestionsSchema.index({ author: 1, description: 1 }, { unique: true });

const makeSignature = async (description, author) => {
    let signature = description;
    signature = signature.replace(/[^\p{L}\s]/gu, " ");
    signature = signature.split(" ").filter(s => s);
    signature = signature.filter(s => s.length > 3).map(s => s.toLowerCase());
    signature = [...new Set(signature)];
    signature.sort();
    signature = signature.join("|");
    return author.toString() + "|" + signature;
};

suggestionsSchema.pre("validate", async function (next) {
    this.signature = await makeSignature(this.description, this.author);
    // console.log(this.signature,"-----",this.description);
    next();
});

suggestionsSchema.methods.toJSON = function() {
    let suggestionsObject = this.toObject();
    delete suggestionsObject.author;
    delete suggestionsObject.signature;
    return suggestionsObject;
};

const Suggestions = mongoose.model("Suggestions", suggestionsSchema);

// module.exports = Suggestions;
export default Suggestions;