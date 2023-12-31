const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
require('dotenv').config();

const ses = new SESClient({ region: 'us-east-2' });

function generateSendEmailCommand(toAddress, fromAddress, message) {
    return new SendEmailCommand({
        Source: fromAddress,
        Destination: {
            ToAddresses: [toAddress],
        },
        Message: {
            Subject: {
                Data: "Your one-time password",
                Charset: "UTF-8",
            },
            Body: {
                Text: {
                    Data: message,
                    Charset: "UTF-8",
                },
            },
        }
    });
}

const sendEmailToken = async (email, token) => {
    const message = `Your one-time password is ${token}`;
    const command = generateSendEmailCommand(email, "li.maxwell14@gmail.com", message);

    try {
        return await ses.send(command);
    } catch (e) {
        console.log(`Error sending email: ${e}`);
    }
}

sendEmailToken("li.maxwell14@gmail.com", "12345678"); // LINE 40

module.exports = sendEmailToken;