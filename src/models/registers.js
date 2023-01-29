const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, "Please enter a valid name!"]
    },
    email:{
        type: String,
        required:[true, "Please enter a valid Email Id!"],
        unique: true
    },
    phone:{
        type: String,
        required:[true, "Please enter a valid phone number!"],
        unique: true
    },
    password:{
        type: String,
        required:[true, "Please enter a valid password!"],
        required: true
    }
});

// now we need to create a collection

const Register = new mongoose.model("Register", userSchema);

module.exports = Register;