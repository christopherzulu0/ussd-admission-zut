const { User,Category,Applications } = require('./models/Schemas');
Support = {


    Contact: async (textArray, phoneNumber) => {
        let response = '';
        const level = textArray.length;

        if (level === 1) {
            response = `CON Support`;
        return response;
        }
    }
};

module.exports = Support;
