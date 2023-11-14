const { User,Category,Applications} = require('./models/Schemas');

// Function for handling non-registered users
const Courses = async (textArray, phoneNumber) => {

  const level = textArray.length;
  let response = "";

  if (level === 1) {
    response = `CON <b>ZUT Courses On Offer</b>
                         Choose an option, to see courses on offer!
                         
                         1. Degree Programmes
                         2. Diploma Programes
                         3. Certificate Programmes
                         4. Professional Programmes
      
      `;
    return response;
  }

  if (level === 2 && textArray[1] === '1') {
    response = `CON 
                  1.  Accountancy(BAC)
                  2.  Software Engineering(BSE)
                  3.  Information Technology(BIT)
                  
                  4.  Cyber security (BCS)
                  5.  Procurement And Supply (BPS)
                 
      `;
    return response;

  }

  if (level === 2 && textArray[1] === '2') {
    response = `CON 
                  1.  Marketing(DM)
                  2.  Business Administration(BA)
                  3.  Information Technology(DIT)
                  4.  Electrical (BCS)
                  5.  Records Management (DRM)
                 
      `;
    return response;

  }

  if (level === 2 && textArray[1] === '3') {
    response = `CON 
                  1.  Basic Computer Skills(BCS)
                  2.  Business Managemenr(CBM)
                  3.  Domestic Electrical Installation and Appliances(CDEIA)
                 
      `;
    return response;

  }

  if (level === 2 && textArray[1] === '4') {
    response = `CON 
                  1.  ABE
                  2.  ACCA
                  3.  Banking and Finance
                  4.  Chatered Account- Zambia
                  5.  Cisco certified Network Associate
                 
      `;
    return response;

  }

};


module.exports = Courses;
