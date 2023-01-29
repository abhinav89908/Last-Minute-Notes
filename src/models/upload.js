const mongoose = require("mongoose");

// const user
// email: email,
// name: name,
// data: [{
//     subject: subject,
//     files: [fileLink]
// }]
const dataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  folder: { type: String },
  courseSection: {
    type: [
      {
        type: {
          course: { type: String },
          yearSection: {
            type: [
              {
                type: {
                  year: { type: Number },
                  subjectSection: {
                    type: [
                      {
                        type: {
                          subject: { type: String },
                          data: {
                            type: [
                              {
                                type: {
                                  user: { type: String },
                                  email: { type: String },
                                  files: { type: [String] },
                                },
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    ],
  },
});

// now we need to create a collection

const LMNData = new mongoose.model("LastMinuteNote", dataSchema);

module.exports = LMNData;
// users:{
//     type: [{
//         type:{
//             email: {type: String},
//             name: {type: String},
//             data: {
//                 type:[
//                     {
//                         type:{
//                             subject: {type: String},
//                             files: {type: [String]}
//                         }

//                     }
//                 ]
//             }

//         }
//     }]

// }
