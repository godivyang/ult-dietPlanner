const mongoose = require("mongoose");
const Suggestions = require("./suggestions");

const dietsSchema = new mongoose.Schema({
    description: {
        type: Array,
        maxLength: 400,
        trim: true,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

dietsSchema.methods.toJSON = function () {
    let dietsObject = this.toObject();
    delete dietsObject._id;
    delete dietsObject.author;
    return dietsObject;
}

// Post-save middleware
dietsSchema.post('save', async function (doc) {
    // console.log(doc)
    const author = this.author;
    doc.description.forEach(async data => {
        Object.values(data).forEach(async val => {
            val.forEach(async diets => {
                diets.forEach(async description => {
                    if(!description) return;
                    try {
                        let suggestion = new Suggestions({ description, author });
                        await suggestion.save();
                    } catch (e) {}
                });
            })
        })
    });

  // You can also perform side-effects here
});

const Diets = mongoose.model("Diets", dietsSchema);

module.exports = Diets