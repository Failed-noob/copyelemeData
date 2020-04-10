const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    phone: {
        type: String,
        required: true
    },
    code: {
        type: String
    }
})

module.exports = Post = mongoose.model("post", PostSchema);