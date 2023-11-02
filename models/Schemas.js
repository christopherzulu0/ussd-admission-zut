const mongoose = require('mongoose');
const shortid = require('shortid');

const UserSchema = mongoose.Schema({
    FirstName: {
       type: String,
       required: true,
     },
    LastName: {
       type: String,
       required: true,
     },
     Email: {
       type: String,
       required: true,
     },
     number: {
       type: Number,
       required: true,
     },
     pin: {
       type: String,
       required:true
     },
     Role:{
      type:String,
      enum: ['User', 'Admin', 'Staff'],
        default: 'User'
     }
   });

   const CategorySchema = mongoose.Schema({

    Category: {
      type: String,
      required: true,
    },

    Courses: [{
      _id: {
        type: mongoose.Types.ObjectId,
        auto: true,
      },
      CourseName: {
        type: String,
        required: true 
      },
     CourseCode: {
        type: String,
        required: true
      }
    }],
   

  });

  const ApplicationSchema = mongoose.Schema({
      ApplicationID: {
      type: String,
      required:false
      },
      _id: {
        type: mongoose.Types.ObjectId,
        auto: true,
      },
      Number:{
        type: Number
      },
      Name: {
        type: String,
        required: true 
      },
     NRC: {
        type: String,
        required: true
      },
      Gender: {
        type: String,
        required: true
      },
      Marital_Status:{
        type: String,
        required: true
      },
      Home_Address:{
        type: String,
        required:true
      },
      Occupation:{
        type: String,
        required: false
      },
      Employeer:{
        type: String,
        required: false
      },
      Program:{
        type: String,
        required: false,
      },
      Course:{
        type: String,
        required: false
      },
      ModeOfStudy:{
        type:String,
        required: false
      },
      Status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
      },
      PaymentStatus: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending'
    }
     
  });
  
  const paymentRecordSchema = mongoose.Schema({
    ApplicationID:{
      type: String,
      required: true
    },
    ApplicantName:{
      type: String,
      required: true
    },
    AmountPaid:{
      type:Number,
      required:true
    },
    Course:{
      type: String,
      required: true
    },
    Date:{
      type: Number,
      default: Date.now
    }

  });
  

const User = mongoose.model('User', UserSchema);
const Category = mongoose.model('Category', CategorySchema);
const Applications = mongoose.model('Applications',ApplicationSchema);
const  PaymentRecord = mongoose.model(' PaymentRecord',paymentRecordSchema)


module.exports = { 
  User,
  Category,
  Applications,
  PaymentRecord
};

