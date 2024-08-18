const { model, Schema, Model } = require("mongoose");
const MESSAGE = new Schema({
    sender:{
        type:String
    },
    msg:{
        type:String
    },
    isSeen:{
        type:Boolean,
        default:false
    }    
});
const Message = new model("Message",MESSAGE);
module.exports = Message;