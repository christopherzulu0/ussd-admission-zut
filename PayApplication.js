const { Transaction, Wallet, User, Savings, PersonalSavings } = require('./models/Schemas');
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

    Pay: async (textArray, phoneNumber) => {
        let response = '';
        let level = textArray.length;

        if (level === 1) {
            response = 'CON <b>Welcome to ZUT Application Payment!</b>\n';

            response += 'Please enter your application number:';
        } else if (level === 2) {
            const applicationNumber = textArray[1];

            // Simulated application fee based on application number (replace this with your actual logic)
            const applicationFee = 50; // Assuming application fee is $50

            // Initiate payment and get payment URL
            const paymentUrl = await PayApplication.initiatePayment(applicationNumber, applicationFee);

            response = `END Please complete your payment of $${applicationFee} by clicking on the following link:\n${paymentUrl}`;
        }

        return response;
    }
};

module.exports = PayApplication;
