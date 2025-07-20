const mongoose = require("mongoose");

const namesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 400
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

namesSchema.methods.toJSON = function() {
    let namesObject = this.toObject();
    delete namesObject.author;
    return namesObject;
};

const Names = mongoose.model("Names", namesSchema);

module.exports = Names;