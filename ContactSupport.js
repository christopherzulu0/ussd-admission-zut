const { User,Category,Applications } = require('./models/Schemas');
Support = {


    Contact: async (textArray, phoneNumber) => {
        let response = '';
        const level = textArray.length;

        if (level === 1) {
            response = `CON <b>Help Desk Contacts</b>

             Administrator: 0761 536370
             Staff: 0776294112
            `;
        return response;
        }
    }
};

module.exports = Support;
