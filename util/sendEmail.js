const aws = require('aws-sdk');

const ses = new aws.SES({
  region: 'your-aws-region',
  accessKeyId: 'your-aws-access-key-id',
  secretAccessKey: 'your-aws-secret-access-key',
});

const sendEmail = async (to, subject, message) => {
  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Text: { Data: message },
      },
      Subject: { Data: subject },
    },
    Source: 'your-sender-email',
  };

  try {
    await ses.sendEmail(params).promise();
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
