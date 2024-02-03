const aws = require('aws-sdk');
const { awsRegion, awsAccessKeyId, awsSecretAccessKey } = process.env;

const ses = new aws.SES({
  region: awsRegion,
  accessKeyId: awsAccessKeyId,
  secretAccessKey: awsSecretAccessKey,
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
    Source: 'olasubomifemi98@gmail.com',
  };

  try {
    await ses.sendEmail(params).promise();
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
