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

  
  const {Transaction, Wallet, User,Savings} = require('./models/Schemas');
  const mongoose = require("mongoose");
  const dotenv = require("dotenv");
  const cors = require("cors");
const { Pay } = require("./PayApplication");
const Courses = require("./Courses");
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
  
  
  async function updateDaysRemaining() {
    const currentDate = new Date();
    const activeLoanRequests = await Savings.find({
      'LoanBalance.Status': 'Approved',
      'LoanBalance.dueDate': { $gte: currentDate },
    });
  
    activeLoanRequests.forEach((circle) => {
      circle.LoanBalance.forEach((loanRequest) => {
        const daysRemaining = Math.ceil(
          (loanRequest.dueDate - currentDate) / (1000 * 60 * 60 * 24)
        );
        loanRequest.daysRemaining = daysRemaining;
      });
  
      circle.save();
    });
  }
  
  async function updateCircleBalance() {
    const currentDate = new Date();
  
    // Find all savings circles with closingDate equal to currentDate
    const circles = await Savings.find({ closingDate: { $gte: currentDate }, });
    const users = await User.findOne({number: phoneNumber});
    const user_id = users._id;
    for (const circle of circles) {
      // Calculate the balance per group member
      const groupMemberCount = circle.GroupMembers.length;
      const balancePerMember = circle.circleBalance[0].Balance / groupMemberCount;
  
      // Credit each group member's wallet
      for (const member of circle.GroupMembers) {
        const wallet = await Wallet.findOne({ user: member.users._id });
        wallet.balance += balancePerMember;
        await wallet.save();
      }
  
      // Deduct the balance from circleBalance
      circle.circleBalance[0].Balance = 0;
      await circle.save();
    }
  }
  
  
  // Schedule the task to run every day
  cron.schedule('0 0 * * *', () => {
    updateDaysRemaining();
    updateCircleBalance();
  });
  
  User.findOne({ number: phoneNumber })
    .then( async (user) => {
      // AUTHENTICATION PARAMETERS
      let userName;
      let userRegistered;
      let response = "";
      let incurredLoan;
      let loan;
      let daysRemaining;
      let total;
      let days;
      let dueDate;
      let currentDate;
      let timeDifference;
      let day;
      let loans;
    
     

      if (!user) {
        userRegistered = false;
      }else {
        userRegistered = true;
        userName = user.FirstName;
      
        num = user.number;
        loan = await Savings.findOne({'LoanBalance.BorrowerNumber':num});
        loans = await Savings.findOne({'LoanBalance.BorrowerNumber':num});
        incurredLoan = loan ? loan.LoanBalance.find(balance => balance.BorrowerNumber === num) : null;
        incurred = incurredLoan ? incurredLoan.totalLoan : 0;
        total = incurred;
      
        //Display the of days remaining to due date
         dueDate = incurredLoan?.dueDate;
        currentDate = new Date();
       timeDifference = dueDate?.getTime() - currentDate.getTime();
        day = timeDifference ? Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) : null;
    
    
      }
      
    //Count the number of Requests
   
  

      // MAIN LOGIC
      if (text == "" && userRegistered == true) {
        response = MainMenu(userName);

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
              response = await Pay(textArray,phoneNumber);
              break;
          case "4":
              response = await Courses(textArray, phoneNumber);
              break;
          // case "5":
          //   response = await WithdrawMoney(textArray,phoneNumber);
          //   break;
          //   case "6":
          //     response = await Notification(textArray, phoneNumber, userName, total, day, loans, totalRequests);
          //     break;
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