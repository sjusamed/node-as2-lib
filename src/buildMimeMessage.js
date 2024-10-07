// src/buildMimeMessage.js
const MimeNode = require('nodemailer/lib/mime-node');

// Build a MIME message with an EDI payload
async function buildMimeMessage(ediPayload) {
  const rootNode = new MimeNode('multipart/mixed', {
    from: 'as2@example.com',
    to: 'recipient@example.com',
    subject: 'EDI Payload',
    'AS2-From': 'my-as2-id',
    'AS2-To': 'partner-as2-id'
  });

  // Add the EDI payload as an attachment
  rootNode
    .appendChild(new MimeNode('application/edi-x12', {
      'Content-Disposition': 'attachment; filename="payload.edi"'
    }))
    .setContent(ediPayload);

  // Await the promise returned by build()
  return new Promise((resolve, reject) => {
    rootNode.build((err, message) => {
      if (err) reject(err);
      else resolve(message);  // Resolve the fully built MIME message
    });
  });
}

module.exports = buildMimeMessage;
