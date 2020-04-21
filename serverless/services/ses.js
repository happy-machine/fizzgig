var AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

module.exports.sendEmail = (args) => {
  const { addresses, body, subject, source } = args;
  var params = {
    Destination: {
      ToAddresses: addresses,
    },
    Message: {
      Body: {
        Html: { Data: body },
      },

      Subject: { Data: subject },
    },
    Source: source,
  };
  return new AWS.SES({ apiVersion: "2010-12-01" }).sendEmail(params).promise();
};
