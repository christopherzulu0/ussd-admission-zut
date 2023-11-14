
const { MainMenu } = require('./menu');
const { User, Category, Applications,PaymentRecord } = require('./models/Schemas');
const menu = require('./menu');

let pendingApplications = [];
let selectedCategories = "";
let selectedApplication =""
const Admin = {
    AdminArea: async (textArray, phoneNumber) => {
        const level = textArray.length;
        let response = "";


        console.log("Received USSD Input:", textArray); // Log received USSD input

        // ... rest of your code ...

        console.log("Response Sent:", response);
         const checkRole = await User.findOne({number: phoneNumber});
         const isAdmin = checkRole.Role;
       console.log("Role:",isAdmin)
        if (level === 1) {

            if(checkRole && checkRole.Role === 'User'){
                response = `CON Only Admins can access this.`;
                return response;

               
            }else if(checkRole && checkRole.Role === 'Admin'){
                response = `CON <b>Welcome back Christopher!</b>
                1. Review Applications
                2. Manage Courses
                3. Payment Records
                4. Add Course category
               `;
          return response;
            }
            

        } if (level === 2 && textArray[1] === '1') {
            try {
                // Logic to retrieve pending applications from the database
                const pendingApplications = await getPendingApplications();
        
                if (pendingApplications.length > 0) {
                    // If there are pending applications, display them for review
                    response = `CON <b>Pending Applications:</b>\n`;
                    pendingApplications.forEach((application, index) => {
                        response += `${index + 1}. Name: <b>${application.Name}</b>(<b>${application.Course}</b>)
                                                  
                                                   `;
                    });
                    response += `0. Back\n`;
                    // Store the available categories for later use
                selectedApplication = pendingApplications;

                } else {
                    // If there are no pending applications, display a message
                    response = `END No pending applications for review.\n`;
                }
            } catch (error) {
                console.error('Error:', error);
                response = 'END An error occurred while retrieving pending applications. Please try again later.';
            }
        }
        

        // Handle user input for reviewing applicationsPaid
        if (level === 3 && textArray[1] === '1') {
            const selectedIndex = parseInt(textArray[2]) - 1;
            const selectedReview = selectedApplication[selectedIndex]
                 // Logic to display the selected application details for review
                 response = `CON <b>Review Application:</b>\n`;
                 response += `Name: <b>${selectedReview.Name}</b>\n`;
                 response += `Course:  <b>${selectedReview.Course}</b>\n`;
                 response += `Program:  <b>${selectedReview.Program}</b>\n`;
                 response += `1. Approve\n`;
                 response += `2. Reject\n`;
                 response += `99. Back\n`;
         
             return response;
            
           
               
        } if (level === 4 && textArray[1] === '1' && textArray[3] === '1') {
            const selectedIndex = parseInt(textArray[2]) - 1;
            const pending = await Applications.find({ Status: 'Pending' });
            const selectedApplication = pending[selectedIndex]; // Assuming pendingApplications is already populated
           
            // Check if selectedApplication exists and its PaymentStatus is 'Pending'
            if (selectedApplication && selectedApplication.Status === 'Pending') {
               

                // Update the application status to 'Approved' in the database
                try {
                    const updatedApplication = await Applications.findOneAndUpdate(
                        { ApplicationID: selectedApplication.ApplicationID },
                        { $set: { Status: 'Approved' } },
                        { new: true }
                    );
        
                    if (updatedApplication) {
                        // Application status updated successfully
                        // You can optionally perform additional actions here
                        response = 'END Application approved successfully!';
                        return response;
                    } else {
                        // Application not found or update failed
                        response = 'END Failed to update application status. Please try again later.';
                        return response;
                    }
                } catch (error) {
                    console.error('Error updating application status:', error);
                    response = 'END An error occurred while updating application status. Please try again later.';
                    return response;
                }
            } else {
                // Invalid application selection or application is not in 'Pending' status
                response = 'END Invalid application selection or application is not in pending status.';
               
            }
        
            return response;
        }
        //Flow for Rejecting  an application
        if(level === 4 && textArray[1] === '1' && textArray[3] === '2'){
            const selectedIndex = parseInt(textArray[2]) - 1;
            const pending = await Applications.find({ Status: 'Pending' });
            const selectedApplication = pending[selectedIndex]; // Assuming pendingApplications is already populated
           
            // Check if selectedApplication exists and its PaymentStatus is 'Pending'
            if (selectedApplication && selectedApplication.Status === 'Pending') {
                // Update the application status to 'Approved' in the database
                try {
                    const updatedApplication = await Applications.findOneAndUpdate(
                        { ApplicationID: selectedApplication.ApplicationID },
                        { $set: { Status: 'Rejected' } },
                        { new: true }
                    );
        
                    if (updatedApplication) {
                        // Application status updated successfully
                        // You can optionally perform additional actions here
                        response = 'END Application has been rejected!';
                        return response;
                    } else {
                        // Application not found or update failed
                        response = 'END Failed to update application status. Please try again later.';
                        return response;
                    }
                } catch (error) {
                    console.error('Error updating application status:', error);
                    response = 'END An error occurred while updating application status. Please try again later.';
                    return response;
                }
            } else {
                // Invalid application selection or application is not in 'Pending' status
                response = 'END Invalid application selection or application is not in pending status.';
               
            }
        
            return response;
        }
    
        //Flow for managing  courses
        if (level === 2 && textArray[1] === '2') {
            response = `CON Manage Courses Menu:
                        1. Add New Course
                        2. Delete Course
                        99. Back`;
            return response;
        }

        if (level === 3 && textArray[2] === '1') {
            response = `CON Enter course name:`;
            return response;
        }

        if (level === 4 && textArray[2] === '1') {
            response = `CON Enter course code:`;
            return response;
        }if (level === 5 && textArray[2] === '1') {
            const categories = await getCategoriesFromDB();
        
            if (categories.length > 0) {
                // If categories are found, display them in the USSD response
                response = `CON Available Categories:\n`;
                categories.forEach((category, index) => {
                    response += `${index + 1}. ${category}\n`;
                });
                response += `0. Back`;
                // Store the available categories for later use
                selectedCategories = categories;
                // Return the response
                return response;
            } else {
                // If no categories are found, provide an appropriate message
                response = `END No categories found.`;
                return response;
            }
        }
        
   
        if (level === 6 && textArray[2] === '1') {
            const course = textArray[3];
            const code = textArray[4];
           // Get the selected category index from the USSD response
            const selectedCategoryIndex = parseInt(textArray[5]) - 1;
            // Retrieve the selected category name using the index
            const selectedCategoryName = selectedCategories[selectedCategoryIndex];

            response = `CON Course Name: <b>${course}</b>
                        Course Code: <b>${code}</b>
                        Program: <b>${selectedCategoryName}</b>

                        1. Confirm
                        99. Go Home
                     `;
            return response;
        }
          //Flow for submiting data to the databse
        if (level === 7 && textArray[2] === '1' && textArray[6] === '1') {
            try {
                const selectedCategoryIndex = parseInt(textArray[5]) - 1;
                const selectedCategoryName = selectedCategories[selectedCategoryIndex];
                // Retrieve the selected category from the database based on selectedCategoryName
                const selectedCategory = await Category.findOne({ Category: selectedCategoryName });
        
                // Check if the category exists
                if (selectedCategory) {
                    // Extract course name and course code from textArray
                    const courseName = textArray[3];
                    const courseCode = textArray[4];
        
                    // Push the new course data into the Courses array of the selected category
                    selectedCategory.Courses.push({
                        CourseName: courseName,
                        CourseCode: courseCode
                        // Add other course-related fields if applicable
                    });
        
                    // Save the updated category back to the database
                    await selectedCategory.save();
        
                    // Respond with a success message if needed
                    response = `END Course "${courseName}" with code "${courseCode}" added to category "${selectedCategoryName}" successfully.`;
                } else {
                    // Handle the case where the specified category does not exist
                    response = 'END Specified category not found. Unable to add the course.';
                }
            } catch (error) {
                // Handle any errors that occur during database operations
                console.error(error);
                response = 'END An unexpected error occurred while adding the course.';
            }
        }
        
        
      //Flow for deleting the courses
      if(level == 3 && textArray[2] === '2'){
        const categories = await getCategoriesFromDB();
        
            if (categories.length > 0) {
                // If categories are found, display them in the USSD response
                response = `CON Available Categories:\n`;
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
                response = `END No categories found.`;
                return response;
            }
      }

      //List of the courses
      if (level === 4 && textArray[2] === '2') {
        try {
            const selectedCategoryIndex = parseInt(textArray[3]) - 1;
            const selectedCategoryName = selectedCategories[selectedCategoryIndex];
            // Retrieve the selected category from the database based on selectedCategoryName
            const selectedCategory = await Category.findOne({ Category: selectedCategoryName });
    
            // Check if the category exists
            if (selectedCategory) {
                // Get the list of courses for editing
                const courses = selectedCategory.Courses;
    
                if (courses.length > 0) {
                    // If courses are found, display them for editing
                    response = `CON <b>Select Course to delete:</b>\n`;
                    courses.forEach((course, index) => {
                        response += `${index + 1}. ${course.CourseName} - ${course.CourseCode}\n`;
                    });
                    response += `99. Back\n`;
                } else {
                    // If no courses are found, provide a message
                    response = `END No courses found for deleting.\n`;
                }
            } else {
                // Handle the case where the specified category does not exist
                response = 'END Specified category not found. Unable to edit courses.';
            }
        } catch (error) {
            // Handle any errors that occur during database operations
            console.error(error);
            response = 'END An unexpected error occurred while retrieving courses for editing.';
        }
    }
     //Action for deleting the selected course
     //Action for deleting the selected course
if (level === 5 && textArray[2] === '2') {
    try {
        const selectedCategoryIndex = parseInt(textArray[3]) - 1;
        const selectedCourseIndex = parseInt(textArray[4]) - 1;

        const selectedCategoryName = selectedCategories[selectedCategoryIndex];
        const selectedCategory = await Category.findOne({ Category: selectedCategoryName });

        if (selectedCategory) {
            const courses = selectedCategory.Courses;

            if (courses.length > 0 && courses[selectedCourseIndex]) {
                const courseToDelete = courses[selectedCourseIndex];
                // Perform the deletion operation here
                // For example, remove the course from the array and save the updated category
                courses.splice(selectedCourseIndex, 1);

                // Save the updated category back to the database
                await selectedCategory.save();

                response = 'END Course deleted successfully!';
            } else {
                response = 'END Invalid course selection. Please try again.';
            }
        } else {
            response = 'END Specified category not found. Unable to delete course.';
        }
    } catch (error) {
        console.error(error);
        response = 'END An unexpected error occurred while deleting the course.';
    }
}
        


        if (level === 2 && textArray[1] === '4') {
            response = `CON Enter category name`;
            return response;
        } if (level === 3 && textArray[1] === '4') {
            response = `CON CategoryName: <b>${textArray[2]}</b>

                        1. Save
                        99.Go Back
                    `;
            return response;
        }

        if (level === 4 && textArray[1] === '4' && textArray[3] === '1') {
            function createCategory() {
                return new Promise(async (resolve, reject) => {
                    const userData = {
                        Category: textArray[2], // Assuming the category name is at index 2 in textArray
                    };

                    try {
                        // create user and register to DB
                        let user = await Category.create(userData);
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

                response = `CON Category <b>${textArray[2]}</b> was added successfully
                  99. Go Home
                `;
                return response;
            }
        } 


        return response;
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

const getPendingApplications = async () => {
    try {
        // Perform a database query to find all applications with status 'pending'
        const pendingApplications = await Applications.find({ Status: 'Pending' });
        return pendingApplications;
    } catch (error) {
        console.error('Error retrieving pending applications:', error);
        throw new Error('Error retrieving pending applications. Please try again later.');
    }


};

module.exports = Admin;
