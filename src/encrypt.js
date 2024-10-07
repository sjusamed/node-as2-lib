const crypto = require('crypto');
const fs = require('fs');

// Encrypt a message using the recipient's public key
function encryptMessage(payload, recipientPublicKeyPath) {
  const recipientPublicKey = fs.readFileSync(recipientPublicKeyPath, 'utf-8');
  const encrypted = crypto.publicEncrypt(recipientPublicKey, Buffer.from(payload));

  return encrypted.toString('base64');  // Return encrypted content in base64 format
}

module.exports = encryptMessage;
