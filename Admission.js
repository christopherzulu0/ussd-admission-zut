const { CircleSavings } = require('./CircleController');
const { MainMenu } = require('./menu');
const { Transaction, Wallet, User, Savings, PersonalSavings } = require('./models/Schemas');
const menu = require('./menu'); 

const Admission = {
  ApplyForAdmission: async (textArray, phoneNumber) => {
    let level = textArray.length;
    let response = "";

    if(level === 1 ){
      response = `CON <b>APPLICATION FORM 2023</b>
      
                      Kindly follow the admission steps to successfully submit your application:

                      1. Personal Information<b>(Step 1)</b>
                      2. Occupation Details<b>(Step 2)</b>
                      3. Additional Information<b>(Step 3)</b>
      `;
      return response;
    }
  }
};

module.exports = Admission;
