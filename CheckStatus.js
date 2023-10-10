const { Transaction, Wallet, User, Savings, PersonalSavings } = require('./models/Schemas');

const CheckStatus = {
    getApplicationStatus: (applicationNumber) => {
        // Implement logic to fetch application status based on the applicationNumber from your database or static data
        // For demonstration purposes, using static data
        const applicationStatuses = {
            '12345': 'accepted',
            '67890': 'pending',
            '13579': 'rejected'
        };

        return applicationStatuses[applicationNumber] || 'not_found';
    },

    Status: async (textArray, phoneNumber) => {
        let response = '';
        const level = textArray.length;

        if (level === 1) {
            response = 'CON <b>Welcome to ZUT Admission Status Page</b>\n';
            response += 'Please enter your application number:';
        } else if (level === 2) {
            const applicationNumber = textArray[1];
            const status = CheckStatus.getApplicationStatus(applicationNumber);

            if (status === 'accepted') {
                response = `END Congratulations! Your application (ID: ${applicationNumber}) has been accepted.`;
            } else if (status === 'pending') {
                response = `END Your application (ID: ${applicationNumber}) is still under review. Please check back later.`;
            } else if (status === 'rejected') {
                response = `END We regret to inform you that your application (ID: ${applicationNumber}) has been rejected.`;
            } else {
                response = `END Application with ID ${applicationNumber} not found. Please check your application number.`;
            }
        }

        return response;
    }
};

module.exports = CheckStatus;
