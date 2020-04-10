const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    phone: {
        type: String,
        required: true
    },
    myAddress: [
        {
            name: {
                type: String
            },
            sex: {
                type: String
            },
            phone: {
                type: String
            },
            address: {
                type: String
            },
            bottom: {
                type: String
            },
            tag: {
                type: String
            }
        }
    ]
})

module.exports = User = mongoose.model("user", UserSchema);