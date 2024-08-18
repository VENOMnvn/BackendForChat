const User = require('../MongoDB/UserSchema');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { createToken } = require('../middleware/auth');


const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        if (email && password) {
            let user = await User.findOne({ email: email });
            if (user != null) {
                const isMatch = bcrypt.compare(password, user.password)
                if (user.email === email && isMatch) {
                    user.password = "hidden"
                    res.send({success:true,
                        user
                        });
                }
                else {
                    res.send({succcess:false,msg:"Incorrect Password"})
                }
            }
            else {
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password, salt);
                const username = email.split('@')[0];
                let user = await User.create({
                    email,
                    username,
                    password:hashPassword,
                });

                user.password = "Hidden";
                res.send({
                    success:true,
                    user:user
                  })
        
            }
        } else {
            res.send({ "status": "failed", "message": "Please fill all the fields" });
        }

    } catch (err) {
        console.log(err)
        res.status(400).send({ "status": "failed", "message": `${err}` })
    }
}

const googlesignin = async (req,res)=>{
    try {
        if(req.body){
            const dataFromGoogle = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo?access_token='+req.body.access_token);
            console.log(dataFromGoogle.data);
            if(dataFromGoogle.data){
                    const existingUser = await User.findOne({email:dataFromGoogle.data.email}).select(' -password');
                    console.log(existingUser,"rr");
                    if(existingUser){
                        const token = createToken(existingUser._id);
                        res.cookie('tokenVenom',token,{path:"/"});
                        res.send({
                            success:true,
                            token,
                            user:existingUser
                        });
                    }else{
                        function generatePassword(length) {
                                charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$@%",
                                retVal = "";
                            for (var i = 0, n = charset.length; i < length; ++i) {
                                retVal += charset.charAt(Math.floor(Math.random() * n));
                            }
                            return retVal;
                        }
                        const password = generatePassword(6);
                        const salt = await bcrypt.genSalt(10);
                        const hashPassword = await bcrypt.hash(password, salt);
                        const user = {
                            email:dataFromGoogle.data.email,
                            username:dataFromGoogle.data.email?.split('@')[0],
                            profilePicture:dataFromGoogle.data.picture,
                            password:hashPassword,
                        }
                        let responseFromCreate = await User.create(user);
                        responseFromCreate.password="hidden";
                        res.send({
                            success:true,
                            newGoogle:true,
                            user:responseFromCreate
                        });
                    }
            }else{
                res.send({
                    msg:"Email Not valid"
                });
            }
            
        }else{
            res.send("Not reached google");
        }
        
    } catch (error) {
            console.log(error);
    }
}

module.exports = {userLogin,googlesignin};