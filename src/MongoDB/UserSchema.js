const { model, Schema } = require("mongoose");
const mongoose = require('mongoose');

const USER = new Schema ({
    email: {
        type: String,
        default: null
    },
    password: {
        type: String
    },
    username : String,
    profilePicture: {
        type: String,
        default: "http://res.cloudinary.com/dcnvvzsdh/image/upload/v1701096607/venomcode/ay07lxp5mxbsiciluo2m.jpg"
    },
    googleUser:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

const User = mongoose.model("User",USER);
module.exports = User;
