const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// Decrypt the AES key using server's private key and then decrypt the message with AES
function decryptMessage(encryptedMessage, encryptedAesKey, iv) {
  // Decrypt the AES key using the server's private key (RSA)
  const privateKey = fs.readFileSync('./certs/recipient_private_key.pem', 'utf-8');
  const aesKey = crypto.privateDecrypt(privateKey, Buffer.from(encryptedAesKey, 'base64'));

  // Decrypt the message using AES
  const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, Buffer.from(iv, 'base64'));
  let decryptedMessage = decipher.update(encryptedMessage, 'base64', 'utf8');
  decryptedMessage += decipher.final('utf8');
  
  return decryptedMessage;
}

// Route to handle AS2 messages and return a signed MDN
app.post('/as2-receive', (req, res) => {
  const { encryptedMessage, encryptedAesKey, iv } = req.body;

  // Decrypt the message
  const decryptedMessage = decryptMessage(encryptedMessage, encryptedAesKey, iv);
  console.log('Decrypted AS2 message:', decryptedMessage);

  // Create the MDN body
  const mdnBody = 'MDN: Message received and processed';

  // Sign the MDN
  const privateKey = fs.readFileSync('./certs/recipient_private_key.pem', 'utf-8');
  const signer = crypto.createSign('SHA256');
  signer.update(mdnBody);
  const mdnSignature = signer.sign(privateKey).toString('base64');

  // Send the signed MDN
  const mdnResponse = `${mdnBody}\n\n${mdnSignature}`;
  res.status(200).send(mdnResponse);
});

// Start the Express server
app.listen(3000, () => {
  console.log('AS2 receiver running on port 3000');
});
