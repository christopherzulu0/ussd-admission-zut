const { User,Category,Applications, PaymentRecord } = require('./models/Schemas');
const axios = require('axios');
const countryCode = require('./util/countryCode');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { v4: uuidv4 } = require('uuid');

const PaymentGatewayAPI = 'https://payment-gateway-api-url'; // Replace this with your actual payment gateway API endpoint

const PayApplication = {
    initiatePayment: async (applicationNumber, amount) => {
        try {
            // Call your payment gateway API to initiate the payment
            const paymentResponse = await axios.post(PaymentGatewayAPI, {
                applicationNumber,
                amount,
                // Add other required payment details here
            });

            // Handle the payment response from the payment gateway API
            // For example, return the payment URL or transaction ID
            const paymentUrl = paymentResponse.data.paymentUrl;
            return paymentUrl;
        } catch (error) {
            console.error('Payment initiation error:', error);
            throw new Error('Payment initiation failed. Please try again later.');
        }
    },

    Pay: async (textArray, phoneNumber, applicantName) => {
        let response = '';
        let level = textArray.length;
    
        if (level === 1) {
            response = 'CON <b>Welcome to ZUT Application Payment!</b>\n';
            response += 'Please enter your application number:';
        } else if (level === 2) {
            const applicationNumber = textArray[1];
    
            try {
                // Check if payment status is already 'Paid'
                const application = await Applications.findOne({ ApplicationID: applicationNumber, PhoneNumber: phoneNumber });
    
                if (application && application.PaymentStatus === 'Paid') {
                    response = 'END Payment for this application has already been made.';
                } else {
                    // Assume the payment is confirmed, you can add payment confirmation logic here if needed
                    const paymentConfirmed = true;
                    const applicationFee = 150;
    
                    if (paymentConfirmed) {
                        // Update payment status for the application in the Applications collection
                        const updatedApplication = await Applications.findOneAndUpdate(
                            { ApplicationID: applicationNumber, Number: phoneNumber },
                            { $set: { PaymentStatus: 'Paid' } },
                            { new: true }
                        );
    
                        if (updatedApplication) {
                            // Record the payment in the PaymentRecord collection
                            const paymentRecord = new PaymentRecord({
                                ApplicationID: applicationNumber,
                                ApplicantName: updatedApplication.Name, // Use the provided applicantName
                                AmountPaid: applicationFee, // You can set the actual paid amount here
                                Course: updatedApplication.Course
                            });
    
                            await paymentRecord.save();
    
                            response = `END Payment for application number ${applicationNumber} confirmed. Your application is now paid and under review.`;
                        } else {
                            response = 'END Application not found or invalid credentials. Please check your application number and try again.';
                        }
                    } else {
                        response = 'END Payment confirmation failed. Please contact customer support for assistance.';
                    }
                }
            } catch (error) {
                console.error('Error updating payment status:', error);
                response = 'END An error occurred while updating payment status. Please try again later.';
            }
        }

  

        return response;
    }
};

module.exports = PayApplication;
