// test/test-as2-functions.js
const buildMimeMessage = require('../src/buildMimeMessage');
const sendAs2Message = require('../src/sendAs2Message');

(async () => {
  try {
    // Sample EDI payload for testing
    const ediPayload = 'ISA*00* *00* *ZZ*MYCOMPANY *ZZ*RECIPIENT *210729*1045*U*00200*000000905*0*P*>GS*PO*MYCOMPANY*RECIPIENT*20210729*1045*905*X*00200';

    // Build the MIME message with the EDI payload
    const mimeMessage = await buildMimeMessage(ediPayload);
    console.log('MIME Message:', mimeMessage);

    // Send the MIME message to a test AS2 endpoint
    sendAs2Message(mimeMessage, 'http://localhost:3000/as2-receive');
  } catch (err) {
    console.error('Error:', err);
  }
})();
