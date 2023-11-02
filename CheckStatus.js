const { User,Category,Applications } = require('./models/Schemas');
const CheckStatus = {


    Status: async (textArray, phoneNumber) => {
        let response = '';
        const level = textArray.length;

        if (level === 1) {
            response = 'CON <b>Welcome to ZUT Admission Status Page</b>\n';
            response += 'Please enter your application number:';
        } else if (level === 2) {
            const applicationNumber = textArray[1];

            try {
                // Check if the application exists in the database
                const application = await Applications.findOne({  Number: phoneNumber });

                if (application) {
                    // Application found, get its status from the database
                    const status = application.Status; // Assuming you have a 'Status' field in your Applications schema

                    if (status === 'Approved') {
                        response = `END Congratulations! Your application (ID: <b>${applicationNumber}</b>) has been accepted.`;
                    } else if (status === 'Pending') {
                        response = `END Your application (ID: <b>${applicationNumber}</b>) is still under review. Please check back later.`;
                    } else if (status === 'Rejected') {
                        response = `END We regret to inform you that your application (ID: <b>${applicationNumber}</b>) has been rejected.`;
                    } else {
                        response = `END Invalid application status: ${status}. Please contact the admissions office for more information.`;
                    }
                } else {
                    response = `END Application with ID <b>${applicationNumber}</b> not found. Please check your application number.`;
                }
            } catch (error) {
                console.error(error);
                response = `END An error occurred while retrieving application status. Please try again later.`;
            }
        
        }

        return response;
    }
};

module.exports = CheckStatus;
