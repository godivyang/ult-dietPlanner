import mongoose from "mongoose";

const clientsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 40
    },
    dob: {
        type: Date
    }, 
    height: {
        type: Number,
        min: [1, "Height is not appropriate."],
        max: [300, "Height is not appropriate."]
    }, 
    weight: {
        type: Number,
        min: [1, "Weight is not appropriate."],
        max: [700, "Weight is not appropriate."]
    }, 
    goal: {
        type: String,
        enum: ["Weight Loss", "Weight Gain", "Better Health"]
    }, 
    notes: {
        type: String,
        minLength: 1,
        maxLength: 1000
    },
    status: {
        type: Boolean,
        default: true
    },
    lastDietDate: {
        type: Date
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

clientsSchema.methods.toJSON = function() {
    let clientsObject = this.toObject();
    delete clientsObject.author;
    return clientsObject;
};

const Clients = mongoose.model("Clients", clientsSchema);

export default Clients;