const express = require("express");
const router = express.Router();
const cron = require('node-cron');
const {
  MainMenu,
  Register,
  unregisteredMenu,
} = require("./menu");
const { Status } = require("./CheckStatus");
// const { CheckBalance } = require("./CheckBalance");
// const { SendMoney } = require("./SendMoney");
// const { WithdrawMoney } = require("./Withdraw_Money");
// const { Notification } = require("./Notifications");
const { ApplyForAdmission } = require("./Admission")

  
  const {User,Category,Applications} = require('./models/Schemas');
  const mongoose = require("mongoose");
  const dotenv = require("dotenv");
  const cors = require("cors");

const Courses = require("./Courses");
const { AdminArea } = require("./Admin");
const {Contact } = require("./ContactSupport");
  const app = express();

  
  //Configuring Express
  dotenv.config();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  mongoose.set('strictQuery', true);
  const connectionString = process.env.DB_URI;
  
  //Configure MongoDB Database
  mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log("MongoDB Running Successfully");
    })
    .catch((err) => {
      console.log({ err });
      console.log("MongoDB not Connected ");
    });



router.post("/", (req, res) => {
console.log("#",req.body)

  const { sessionId, serviceCode, phoneNumber, textbody } = req.body;
  
 
  // }
  let spintext
  String(req.body.text).lastIndexOf('*99') != -1 ? spintext = req.body.text.slice(String(req.body.text).lastIndexOf('*99') + 4) : spintext = req.body.text ;
  const text = spintext
  
  
  
  User.findOne({ number: phoneNumber })
    .then( async (user) => {
      // AUTHENTICATION PARAMETERS
      let userName;
      let userRegistered;
      let response = "";
      let Admins = ""
      
    
     

      if (!user) {
        userRegistered = false;
      }else {
        userRegistered = true;
        userName = user.FirstName;
      
       
    
      }
      
      Admins = await User.findOne({ number: phoneNumber });
      checkRole = Admins ? Admins.Role : null;
      isSupplier = Admins ? Admins.Role : null;
      
      // Check if the user has the 'Admin' role
      let isAdmin = checkRole === 'Admin';
  

      // MAIN LOGIC
      if (text == "" && userRegistered == true) {
        response = MainMenu(userName,isAdmin);

      } else if (text == "" && userRegistered == false) {
        response = unregisteredMenu();
      } else if (text != "" && userRegistered == false) {
        const textArray = text.split("*");
        switch (textArray[0]) {
          case "1":
            response = await Register(textArray, phoneNumber);
            break;
          default:
            response = "END Invalid choice. Please try again";
        }
      } else {
        const textArray = text.split("*");
        switch (textArray[0]) {
          
          case "1":
            response = await ApplyForAdmission(textArray, phoneNumber);
            break;
          case "2": 
              response = await Status(textArray, phoneNumber);
              break;
          case "3":
              response = await Courses(textArray, phoneNumber);
              break;
          case "4":
            response = await Contact(textArray, phoneNumber);
            break;
          case "5":
            response = await AdminArea(textArray,phoneNumber);
            break;
           
          default:
            response = "END Invalid choice. Please try again";
        }

      }
  
  // Print the response onto the page so that our SDK can read it
  res.set("Content-Type: text/plain");
  res.send(response);
  // DONE!!!
})

.catch((err) => {
    console.log({ err });
  });
});

module.exports = router;