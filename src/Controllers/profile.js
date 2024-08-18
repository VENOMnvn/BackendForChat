const User = require("./../MongoDB/UserSchema");
// import {v2 as cloudinary} from 'cloudinary';
// const cloudinary = require("cloudinary");

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
//   api_key: process.env.CLOUDINARY_CLIENT_API,
//   api_secret: process.env.CLOUDINARY_CLIENT_SECRET_KEY,
// });

const getUserQuery = async (req, res) => {
  const {limit} = req.query;
  try {
    if (limit) {
        let users = await User.find().limit(limit);
        res.send({ users });
        return;
    }
    let users = await User.find();
    res.send({ users });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {getUserQuery};
