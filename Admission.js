
const { User,Category,Applications } = require('./models/Schemas');
const menu = require('./menu'); 

let selectedCategories = "";
let selectedCourses = "";
let course_s ="";
let courses ="";
const shortid = require('shortid');

const Admission = {
  ApplyForAdmission: async (textArray, phoneNumber) => {
    let level = textArray.length;
    let response = "";

    if(level === 1 ){
      response = `CON <b>APPLICATION FORM PROCESS 2023</b>

                      1. Personal Information<b>(Step 1)</b>
                      2. Occupation Details<b>(Step 2)</b>
                      
      `;
      return response;
    }

    //Flow for personal information of the applicant
    if(level ===2 && textArray[1] === '1'){
      const SavedInform = await Applications.findOne({ Number: phoneNumber });
      if(SavedInform){
        response = `CON You have already added personal information details.Proceed with step 2.`;
        return response;
      }else{
        response = `CON What is your nrc number?`;
        return response;
      }
     
    }
    if(level ===3 && textArray[1] === '1'){
      response = displayGender();
      return response;
      
    }if(level === 4 && textArray[1] === '1'){
      response = displayMaritalStatus();
      return response;

    }if(level === 5 && textArray[1] === '1'){
      response = `CON What is your home address?`;
      return response;
    }if(level === 6 && textArray[1] === '1'){
      const selectedGender = textArray[3]; // Assuming textArray[6] contains the selected study mode option
      const selectedGenderText = getGenderText(selectedGender);

      const selectedStatus = textArray[4]; // Assuming textArray[6] contains the selected study mode option
      const selectedStatusText = getMaritalStatusText(selectedStatus);

     
      response = `CON  
                    NRC: <b>${textArray[2]}</b>
                    Gender: <b>${selectedGenderText}</b>
                    Marital_Staus: <b>${selectedStatusText}</b>
                    Home_Address: <b>${textArray[5]}</b>

                    1.Save information
                    99. Go Home
                    `;
                    return response;
    }if(level === 7 && textArray[1]==='1' && textArray[6] === '1'){
      async function createCategory() {
        const selectedGender = textArray[3]; // Assuming textArray[6] contains the selected study mode option
      const selectedGenderText =  getGenderText(selectedGender);

      console.log("Gender:",selectedGenderText)

      const selectedStatus = textArray[4]; // Assuming textArray[6] contains the selected study mode option
      const selectedStatusText = getMaritalStatusText(selectedStatus);
      console.log("MaritalStatus:",selectedStatusText)

      const names = await  User.findOne({number: phoneNumber});
      const username = names.FirstName;
      console.log("username:",username)

        return new Promise(async (resolve, reject) => {
            const userData = {
               Number:phoneNumber,
               Name:username, 
               NRC:textArray[2],
               Marital_Status:selectedStatusText,
               Gender:selectedGenderText,
               Home_Address:textArray[5],
              
            };

            try {
                // create user and register to DB
                let user = await Applications.create(userData);
                resolve(user);
            } catch (error) {
                reject(error);
            }
        });
    }

    // Call the asynchronous function and handle the response
    let user = await createCategory();
    // If user creation failed
    if (!user) {
        response = "END An unexpected error occurred... Please try again later";
        return response;
    }
    // if user creation was successful
    else {

        response = `END You have successfully added your personal information.
        Now add step 2 information, to submit your application`;
        return response;
    }
    }

    //Flow for Occupation Details of the applicant
    if(level === 2 && textArray[1] === '2'){
      const PersonalInformation = await Applications.findOne({ Number: phoneNumber });
       if(PersonalInformation){
        response = `CON tell us your present occupation..`;
        return response;
       }else{
        response = `CON Add your personal information first, in order to proceed with step 2.`
        return response; 
      }
      
    }if(level === 3 && textArray[1] === '2'){
      response = `CON Name of your present employer?`;
      return response;
   }if(level === 4 && textArray[1] === '2'){
    const categories = await getCategoriesFromDB();
        
            if (categories.length > 0) {
                // If categories are found, display them in the USSD response
                response = `CON Choose the Program you want to study:\n`;
                categories.forEach((category, index) => {
                    response += `${index + 1}. ${category}\n`;
                });
                response += `99. Back`;
                // Store the available categories for later use
                selectedCategories = categories;
                // Return the response
                return response;
            } else {
                // If no categories are found, provide an appropriate message
                response = `END No programs found.`;
                return response;
            }
 }

 if(level === 5 && textArray[1] === '2'){
  try {
    const selectedCategoryIndex = parseInt(textArray[4]) - 1;
    const selectedCategoryName = selectedCategories[selectedCategoryIndex];
    // Retrieve the selected category from the database based on selectedCategoryName
    const selectedCategory = await Category.findOne({ Category: selectedCategoryName });

    // Check if the category exists
    if (selectedCategory) {
        // Get the list of courses for editing
         courses = selectedCategory.Courses;

        if (courses.length > 0) {
            // If courses are found, display them for editing
            response = `CON <b>Courses in ${selectedCategoryName}:</b>\n`;
            courses.forEach((course, index) => {
                response += `${index + 1}. ${course.CourseName} - ${course.CourseCode}\n`;
            });
            response += `99. Back\n`;
        } else {
            // If no courses are found, provide a message
            response = `END No courses in this program found.\n`;
        }
    } else {
        // Handle the case where the specified category does not exist
        response = 'END Specified courses not found. Unable to view courses.';
    }
} catch (error) {
    // Handle any errors that occur during database operations
    console.error(error);
    response = 'END An unexpected error occurred while retrieving courses .';
}
 }
 
 
 if (level === 6 && textArray[1] === '2') {
  response = displayStudyModes();
  return response;
}

if (level === 7 && textArray[1] === '2') {
  const selectedCategoryIndex = parseInt(textArray[4]) - 1;
  const selectedCategoryName = selectedCategories[selectedCategoryIndex];

  const selectedCourse = parseInt(textArray[5]) - 1;
  const course = courses[selectedCourse];
  const ChoosenCourse = course.CourseName;


  const selectedStudyModeOption = textArray[6]; // Assuming textArray[6] contains the selected study mode option
  const selectedStudyModeText = getStudyModeText(selectedStudyModeOption);

  response = `CON Confirm the details below:
  
              Occupation: <b>${textArray[2]}</b>
              Employer:  <b>${textArray[3]}</b>
              Program:  <b>${selectedCategoryName}</b>
              Course: <b>${ChoosenCourse}</b>
              Study Mode:  <b>${selectedStudyModeText}</b>
  
              1. Confirm
              99. Go Home
             `;
  return response;
}

//Submit Occupation details to the database

 
    if (level === 8 && textArray[1] === '2' && textArray[7] === '1') {
        const existingApplication = await Applications.findOne({ Number: phoneNumber });

        if (existingApplication) {
            // Update existing application details
            try {
              const selectedCategoryIndex = parseInt(textArray[4]) - 1;
              const selectedCategoryName = selectedCategories[selectedCategoryIndex];

              const selectedCourse = parseInt(textArray[5]) - 1;
              const course = courses[selectedCourse];
              const ChoosenCourse = course.CourseName;


              const selectedStudyModeOption = textArray[6]; // Assuming textArray[6] contains the selected study mode option
              const selectedStudyModeText = getStudyModeText(selectedStudyModeOption);
              const appid = shortid.generate();
                
                existingApplication.ApplicationID = appid;
                existingApplication.Occupation = textArray[2];
                existingApplication.Employer = textArray[3];
                existingApplication.Program = selectedCategoryName;
                existingApplication.Course = ChoosenCourse;
                existingApplication.ModeOfStudy = selectedStudyModeText;
                existingApplication.Status = 'Pending';

                await existingApplication.save();
                response = `END Your Application has been submitted. 
                     You can check for application status using: ${appid}`;
                     return response;
            } catch (error) {
                response = `END An error occurred while updating your information. Please try again later.`;
            }
        } else {
              response = `CON Add your personal information first in step 1! to submit your application`;
              return response;
        }

        return response;
    } 
  



return response   
  }
};

async function getCategoriesFromDB() {
  try {
      // Fetch categories from the database
      const categories = await Category.find({}, 'Category'); // Assuming you have a 'Category' field in your Category schema
      return categories.map(category => category.Category); // Extract category names
  } catch (error) {
      console.error(error);
      throw error;
  }
}


//Get study modes
function displayStudyModes() {
  let response = `CON Choose the mode of study:\n`;
  response += `1. Fulltime\n`;
  response += `2. Evening\n`;
  response += `3. Day\n`;
  response += `4. Open & Distance Learning\n`;
  return response;
}

//Extract selected study modes
function getStudyModeText(selectedOption) {
  switch (selectedOption) {
      case '1':
          return 'Fulltime';
      case '2':
          return 'Evening';
      case '3':
          return 'Day';
      case '4':
          return 'Open & Distance Learning';
      default:
          return 'Unknown Study Mode';
  }
}

//Get Gender type
function displayGender() {
  let response = `CON Choose the mode of study:\n`;
  response += `1. Male\n`;
  response += `2. Female\n`;
  return response;
}


//Extract Gender type values
function getGenderText(selectedOption) {
  switch (selectedOption) {
      case '1':
          return 'Male';
      case '2':
          return 'Female';
      default:
          return 'Unknown Gender Type';
  }
}

//Get Marital Status
function displayMaritalStatus() {
  let response = `CON Choose the mode of study:\n`;
  response += `1.Married\n`;
  response += `2. Single\n`;
  response += `3. Divorced\n`;
  response += `3. Widow\n`;
  return response;
}


//Extract Marital Status values
function getMaritalStatusText(selectedOption) {
  switch (selectedOption) {
      case '1':
          return 'Married';
      case '2':
          return 'Single';
      case '3':
          return 'Divorced';
      case '4':
          return 'Widow';
      default:
          return 'Unknown Marital Status';
  }
}

module.exports = Admission;
