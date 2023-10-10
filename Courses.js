const {Transaction, Wallet, User,Savings,PersonalSavings} = require('./models/Schemas');

// Function for handling non-registered users
const Courses = async (textArray, phoneNumber) => {
 
    const level = textArray.length;
    let response = "";
     
    if(level === 1){
      response = `CON <b>ZUT Courses On Offer</b>
                         Choose an option, to see courses on offer!
                         
                         1. Degree Programmes
                         2. Diploma Programes
                         3. Certificate Programmes
                         4. Professional Programmes
      
      `;
      return response;
    }
    
    if(level === 2 && textArray[1] === '1'){
      response = `CON 
                  1. Bachelors Of Degree in Accountancy(BAC)
                  2. Bachelors Of Degree in Software Engineering(BSE)
                  3. Bachelors Of Degree in Information Technology(BIT)
                  4. Bachelors Of Degree in Cyber security (BCS)
                  5. Bachelors Of Degree in Procurement And Supply (BPS)
                 
      `;
      return response;

    }

    if(level === 2 && textArray[1] === '2'){
      response = `CON 
                  1. Diploma In Marketing(DM)
                  2. Diploma In Business Administration(BA)
                  3. Diploma In Information Technology(DIT)
                  4. Diploma In Electrical (BCS)
                  5. Diploma In Records Management (DRM)
                 
      `;
      return response;

    }

    if(level === 2 && textArray[1] === '3'){
      response = `CON 
                  1. Certificate in Basic Computer Skills(BCS)
                  2. Certificate in Business Managemenr(CBM)
                  3. Certificate in Domestic Electrical Installation and Appliances(CDEIA)
                 
      `;
      return response;

    }

    if(level === 2 && textArray[1] === '4'){
      response = `CON 
                  1. Professional in ABE
                  2. Professional in ACCA
                  3. Professional in Banking and Finance
                  4. Professional in Chatered Account- Zambia
                  5. Professional in Cisco certified Network Associate
                 
      `;
      return response;

    }
    
  };
  

module.exports = Courses;
