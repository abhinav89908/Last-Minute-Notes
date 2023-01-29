const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
require("./db/conn");

// recieving register
const Register = require("./models/registers");
// recieveing dataSchema
const LMNData = require("./models/upload");
const { getMaxListeners } = require("process");
// const exp = require("constants");

const port = process.env.PORT || 8000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
const resources_path = path.join(__dirname, "../resources");

app.use(express.json());
app.use(express.urlencoded({extended: false})); 

app.use(express.static(static_path));
app.use(express.static(resources_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

let owner;
let userLogin;

app.get("/", (req, res)=>{
    const getOwner = async() =>{
        owner = await LMNData.findOne({email: "abhinav89908@gmail.com"});
        if(owner!=null){
            console.log(owner);
            console.log("Starting with owner");

            let userName = "";
            if(userLogin!=null){
                userName = userLogin.name;

            } 
            res.render("index",{
                csection: owner.courseSection,
                username: userName
                // userEmail: userLogin.email
            });
        }
        else{
            console.log("Starting without owner");
            res.render("index");
        }
    }
    getOwner();
    // res.render("index",{
    //     // csection: owner.courseSection,
    //     usename: userLogin.name,
    //     userEmail: userLogin.email
    // });
})

app.get("/register", (req, res)=>{
    let userName = "";
    if(userLogin!=null){ userName = userLogin.name; }
    res.render("register",{
        owner: owner,
        error: "",
        username: userName   
    });
})

app.get("/login", (req, res)=>{
    let userName = "";
    if(userLogin!=null){ userName = userLogin.name; }
    res.render("register",{
        owner: owner,
        username: userName
    });
})
// Upload files
app.get("/uploads", (req, res)=>{
    let userName = "";
    if(userLogin!=null){ userName = userLogin.name; }
    res.render("uploads",{
        owner: owner,
        username: userName
    });
})
app.get("/about", (req, res)=>{
    let userName = "";
    if(userLogin!=null){ userName = userLogin.name; }
    res.render("about",{
        username: userName
        // owner: owner
    });
})
app.get("/practice", (req, res)=>{
    let userName = "";
    if(userLogin!=null){ userName = userLogin.name; }
    res.render("practice",{
        csection: owner.courseSection,
        username: userName
    });
})
app.get("/studyMaterial", (req, res)=>{
    let userName = "";
    if(userLogin!=null){ userName = userLogin.name; }
    res.render("studyMaterial",{
        username: userName,
        csection: owner.courseSection
    });
})

const updateDoc = async()=>{
    try{
        const updt = await LMNData.findOneAndUpdate({email: "abhinav89908@gmail.com"}, {name:"Abhinav"}, (err, data)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log(data.name);
            }
        })
        console.log(updt.name);

    }catch(err){
        console.log(err);
    }
}
// updateDoc();
const findDoc = async()=>{
    try {
        const result = await LMNData.findOne({email:"abhinav89908@gmail.com"}, (err, data)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("I am here");
                console.log(data.name);
            }
        });
        
    } catch (error) {
        console.log(error);
    }
}
// findDoc();

app.post("/upload", async (req, res)=>{
    try { 
        
        console.log(req.body.firstName2);
        const email = req.body.email2;
        const name = req.body.firstName2;
        const course = req.body.course;
        const year = req.body.year;
        const subject = req.body.subject;
        const fileLink = req.body.fileLink;
        const ownerEmail = "abhinav89908@gmail.com";

        // const owner = await LMNData.findOne({email: ownerEmail});

        // create document or insert
        const createDocument = async()=>{
            try{
                const newFile = new LMNData({
                    name: "Abhinav",
                    email: "abhinav89908@gmail.com",
                    folder: "Owner Folder",
                    courseSection:[
                        {
                            course: course,
                            yearSection:[
                                {
                                    year: year,
                                    subjectSection:[
                                        {
                                            subject: subject,
                                            data:[
                                                {
                                                    user: name,
                                                    email: email,
                                                    files: [fileLink]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                })
                const result = await newFile.save();
                console.log(result);
            }catch(err){
                console.log(err);
            }
        }
        // createDocument();
        const sendMail = async() =>{
            console.log("Sending Mail..");
            var nodemailer = require('nodemailer');

            var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'demo89908@gmail.com',
                pass: 'kdissboftikfriqy'
            }
            });

            var mailOptions = {
            from: 'demo89908@gmail.com',
            to: 'abhinav89908@gmail.com',
            subject: 'Notes uploading request',
            text: `Hola Amigos!
            ${name} wants to contribute his notes in our website.
            Details: 
            Email: ${email}
            Course: ${course}
            Year: ${year}
            Subject: ${subject}
            File Link: ${fileLink}`
            };

            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
            });
        }

        const getDocument = async() => {
            try{
                // const result = await LMNData.findOne({email});

                if(owner==null){
                    console.log("Owner not found");
                    createDocument();
                }
                else{
                    // console.log(owner)
                    // console.log(owner.users)
                    console.log("Owner Found");
                    let i, j, k, l;
                    // console.log(owner);
                    // let filess;
                    let csection;
                    const updateMain = async()=>{
                        const updtMain = await LMNData.findOneAndUpdate({email: ownerEmail}, {courseSection: csection})//, (err, data)=>{
                    //         if(err){
                    //             console.log("Owner not found!");
                    //             // createDocument();
                    //             console.log(err);
                    //         }
                    //         else{
                    //             // owner.users[i].data[k].files = filess;
                    //             console.log('Data updating...');
                    //             console.log(data);
                    //         }
                    //     })
                    
                        console.log("Now will code to update");
                    }
                    // updateMain();
                    let flg1=1, flg2=1, flg3=1, flg4=1;
                    csection = owner.courseSection;
                    for(i=0; i<csection.length; i++){
                        if(csection[i].course == course){
                            console.log("Course Matched");
                            flg1=0;
                            for(j=0; j<csection[i].yearSection.length; j++){
                                if(csection[i].yearSection[j].year==year){
                                    console.log("Year Matched");
                                    flg2=0;
                                    for(k=0; k<csection[i].yearSection[j].subjectSection.length; k++){
                                        if(csection[i].yearSection[j].subjectSection[k].subject==subject){
                                            console.log("Subject Matched");
                                            flg3=0
                                            for(l=0; l<csection[i].yearSection[j].subjectSection[k].data.length; l++){
                                                if(csection[i].yearSection[j].subjectSection[k].data[l].email==email){
                                                    console.log("Email Matched");
                                                    flg4=0;
                                                    csection[i].yearSection[j].subjectSection[k].data[l].files.push(fileLink);
                                                    updateMain();
                                                    break;
                                                }
                                            }
                                            if(flg4==1){
                                                const data = {
                                                    user: name,
                                                    email: email,
                                                    files: [fileLink]
                                                }
                                                csection[i].yearSection[j].subjectSection[k].data.push(data);
                                                updateMain();
                                            }
                                            break;
                                        }     
                                    }
                                    if(flg3==1){
                                        const data = {
                                            user: name,
                                            email: email,
                                            files: [fileLink]
                                        }

                                        const subjectSection = {
                                            subject: subject,
                                            data: [data],

                                        }
                                        csection[i].yearSection[j].subjectSection.push(subjectSection);
                                        updateMain();
                                    }
                                    break;
                                }
                            }
                            if(flg2==1){
                                const data = {
                                    user: name,
                                    email: email,
                                    files: [fileLink]
                                }
                                const subjectSection = {
                                    subject: subject,
                                    data: [data],
                                }
                                const yearSection = {
                                    year: year,
                                    subjectSection: [subjectSection]
                                }
                                csection[i].yearSection.push(yearSection);
                                updateMain();
                            }
                            break;
                        }    
                    }
                    if(flg1==1){
                        const data = {
                            user: name,
                            email: email,
                            files: [fileLink]
                        }
                        const subjectSection = {
                            subject: subject,
                            data: [data],
                        }
                        const yearSection = {
                            year: year,
                            subjectSection: [subjectSection]
                        }
                        const courseSection = {
                            course: course,
                            yearSection : [yearSection]
                        }
                        csection.push(courseSection);
                        updateMain();
                    }

                    // for(i=0; i<owner.users.length; i++){
                    //     if(owner.users[i].email==email){
                    //         flg1=0;
                    //         console.log("user email matched");
                    //         for(j=0; j<owner.users[i].data.length; j++){
                    //             if(owner.users[i].data[j].subject==subject){
                    //                 flg2=0;
                    //                 console.log("subject found");
                    //                 users2 = owner.users;
                    //                 users2[i].data[j].files.push(fileLink);
                    //                 console.log(users2)
                    //                 updateMain();    
                    //                 break;   
                    //             }
                    //         }
                    //         if(flg2==1){
                    //             users2 = owner.users;
                    //             const newSub = {
                    //                 subject: subject,
                    //                 files: [fileLink]
                    //             }
                    //             users2[i].data.push(newSub);
                    //             console.log(newSub);
                    //             console.log(users2[i].data[1]);
                    //             updateMain()
                    //         }
                    //         break;
                            
                    //     }
                    // }
                    // if(flg1==1){
                    //     users2 = owner.users;
                    //     const newSub = {
                    //         subject: subject,
                    //         files: [fileLink]
                    //     }
                    //     const newEmail = {
                    //         email: email,
                    //         name: name,
                    //         data: [newSub]
                    //     }
                    //     users2.push(newEmail);
                    //     // console.log(users2);
                    //     updateMain();

                    // }
                }

            
                // owner.files.push(fileLink);
                // const updateMain = async()=>{
                //     const updtMain = await LMNData.findOneAndUpdate({email: ownerEmail}, {files: owner.files}, (err, data)=>{
                //         if(err){
                //             console.log(err);
                //         }
                //         else{
                //             console.log(data);
                //         }
                //     })
                // }
                // console.log(updtMain);

                // if(result==null){
                //     console.log("Empty! Creating first file.");
                //     createDocument();
                // } 
                // else{
                //     console.log("Now we will code to update");

                //     owner.files.push(fileLink);
                //     // console.log(result.files);

                //         const updt = await LMNData.findOneAndUpdate({email: ownerEmail}, {files: result.files}, (err, data)=>{
                //             if(err){
                //                 console.log(err);
                //             }
                //             else{

                //                 console.log(data);
                //                 // updateMain();
                //             }
                //         })

                    
                    
                //     console.log(result)

                // }
            }catch(err){
                console.log(err);
            }
        }  
        if(email=="abhinav89908@gmail.com"){
            getDocument();
        }
        else{
            sendMail();
            // res.status(201).send("Sending mail");

        }
        // console.log(owner);
        let userName = "";
        if(userLogin!=null){ userName = userLogin.name; }
        
        res.status(201).render("index",{
            csection: owner.courseSection,
            username: userName,
        });

    } catch (err) {
        res.status(400).send(err);
        console.log(err);
    }
})

// Create a new user in out database
app.post("/register", async (req, res)=>{
    try { 
        const registerUser = new Register({
            name: req.body.firstName,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password
        })
        let passError = "", nameError = "", phoneError = "";
        if(req.body.password !== req.body.cpassword){
            passError = "* Password not matched";
        }
        const phone = req.body.phone;
        const name = req.body.phone;
    
        if(phone.length!=10){
            phoneError = "* Phone number must be of 10 digits";
        }
        if(name.length<6){
            nameError = "* Name must be of atleast 6 characters";
        }
        
        if(passError.length>0 || nameError.length>0 || phoneError.length>0){
            console.log("Validation error");

            res.status(400).render("register",{
                nameError,
                phoneError,
                passError
            });
            nameError="";
            passError="";
            phoneError="";
        }
        else{
            const registerd = await registerUser.save();
            res.status(201).render("index",{
                csection: owner.courseSection,
                usename: userLogin.name,
                userEmail: userLogin.email
            });
        }
        
    } catch (err) {
        let formError = "* Some error occurred! Enter unique data!";
        res.status(400).render("register",{
            formError
        });
        console.log(err);
    }
})

// Login Check
app.post("/login", async (req, res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        
        userLogin = await Register.findOne({email: email});
        if(password === userLogin.password){
            res.status(201).render("index",{
                csection: owner.courseSection,
                username: userLogin.name,
                userEmail: userLogin.email
            });
        }else{
            res.send("Invalid Login!!!");
        }
    }catch(err){
        res.status(400).send("Invalid Login!!");
    }
})

app.listen(port, ()=>{
    console.log(`Server is running at port no. ${port}`);
})