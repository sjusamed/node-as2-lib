const crypto = require('crypto');
const fs = require('fs');

// Decrypt a message using the recipient's private key
function decryptMessage(encryptedMessage, privateKeyPath) {
  const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
  const decrypted = crypto.privateDecrypt(privateKey, Buffer.from(encryptedMessage, 'base64'));

  return decrypted.toString('utf-8');  // Return the decrypted message as a string
}

module.exports = decryptMessage;
