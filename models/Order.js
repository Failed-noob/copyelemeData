const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    orderlist: [
        {
            orderInfo: {
                type: Object
            },
            userInfo: {
                type: Object
            },
            remarkInfo: {
                type: Object
            },
            date: {
                type: Date,
                default: Date.now
            },
            totalPrice: {
                type: Number
            }
        }
    ]
})

module.exports = Order = mongoose.model("order", OrderSchema);