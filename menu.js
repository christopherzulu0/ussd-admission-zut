const {User,Category,Applications} = require('./models/Schemas');
const axios = require("axios");
const countryCode = require("./util/countryCode");
const bcrypt = require("bcrypt");
const qs = require("qs");

const HandleSavings = require('./Courses')
const { response } = require('express');
const CircleSavings = require("./menu")
const sendSMS = async (phoneNumber, message) => {
  const API_KEY = "1ee443c7d1bbe988ba87ead7b338cdc3aca397ecb471337570ac0b18b74ad7f9";
  const USERNAME = "sandbox";
  const SMS_URL = `https://api.sandbox.africastalking.com/version1/messaging`;

  try {
    const response = await axios.post(SMS_URL, qs.stringify({
      to: phoneNumber,
      message: message,
      apiKey: API_KEY,
      username: USERNAME,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        apiKey: API_KEY,
        username: USERNAME,
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

const credentials = {
  apiKey: process.env.apiKey,
  username: process.env.username
};

const sendSMS2 = async (phoneNumber, message) => {
  const API_KEY = "1ee443c7d1bbe988ba87ead7b338cdc3aca397ecb471337570ac0b18b74ad7f9";
  const USERNAME = "sandbox";
  const SMS_URL = `https://api.sandbox.africastalking.com/version1/messaging`;

  try {
    const response = await axios.post(SMS_URL, qs.stringify({
      to: phoneNumber,
      message: message,
      apiKey: API_KEY,
      username: USERNAME,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        apiKey: API_KEY,
        username: USERNAME,
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};




const menu = {
  MainMenu:(userName,isAdmin) => {
    
   if(isAdmin){
      
   const response = `CON Hello ${userName}!
               5. Manage your dashboard
               99. Go Home
               `;
    return response;
    
   }else{
    const response = `CON Welcome <b>${userName}!</b> to ZUCT Admission platform.

    1. Apply For Admission
    2. Check Application Status
    3. Courses Offered At ZUT
    4. Contact Support
    `;
return response;
   }
     
    
    
  },
  unregisteredMenu: () => {
    const response = `CON <b>Create Your ZUT Account To Proceed</b>
            1. Create Account
            `;

    return response;
  },
  Register: async (textArray, phoneNumber) => {
    const level = textArray.length;
    let response = "";
    
    switch (level) {
      case 1:
        response = `CON 
                    <b>First Name:</b>
                  "Welcome to our service! To personalize your experience, may we know your first name, please?"
        `;
        break;
      case 2:
        response = `CON 
                    <b>Last Name:</b>
                    "Thank you! Could you please provide your last name for our records?"
        `;
        break;
      case 3:
        response = `CON 
                    <b>Email:</b>
                    "Great, ${textArray[1]}! To stay connected, what's your email address?"
         `;
        break;
      case 4:
        response = "CON Set a login pin(4 Digits)";
        break;
      case 5:
        response = "CON Please confirm your PIN:";
        break;
      case 6:
        response = `CON Confirm Your Details:
        
                    First Name: ${textArray[1]}
                    Last Name: ${textArray[2]}
                    Email: ${textArray[3]}
                    Pin: ${textArray[5]}

                    1.Confirm & continue
                   `;
        break;
      case 7:
        if(textArray[6] == 1){
        const pin = textArray[4];
        const confirmPin = textArray[5];
        // Check if the name is strictly alphabets via regex
        if (/[^a-zA-Z]/.test(textArray[1])) {
          response = "END Your full name must not consist of any number or symbol. Please try again";
        }
        // Check if the pin is 5 characters long and is purely numerical
        else if (pin.toString().length != 4 || isNaN(pin)) {
          response = "END Your must be 4 digits.Please try again!";
        }
        // Check if the pin and confirmed pin is the same
        else if (pin != confirmPin) {
          response = "END Your pin does not match. Please try again";
        } else {
          // proceed to register user
          async function createUser() {
            const userData = {
              FirstName: textArray[1],
              LastName: textArray[2],
              Email: textArray[3],
              number: phoneNumber,
              pin: textArray[4],
            };
    
            // hashes the user pin and updates the userData object
            bcrypt.hash(userData.pin, 10, (err, hash) => {
              userData.pin = hash;
            });
    
            // create user and register to DB
            let user = await User.create(userData);


            return user;
          }
    
          // Assigns the created user to a variable for manipulation
          let user = await createUser();
          // If user creation failed
          if (!user) {
            response = "END An unexpected error occurred... Please try again later";
          }
          // if user creation was successful
          else {
            let userName = user.FirstName;
            let phoneNumber = user.number;
            
        // Call the sendSMS function after successful registration
            sendSMS2(phoneNumber, "Congratulations! You have successfully submitted the form.");
            response = `END Congratulations ${userName}, You have successfully created an account.`;
          }
        }
        }
        break;
      default:
        break;
    }
    return response;
  },
  
    

  
  
};

module.exports = menu;