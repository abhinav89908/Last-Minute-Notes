const mongoose = require("mongoose");

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/LMNRegister", {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log("Database connected successfully..."))
.catch((err) => console.log(err));  