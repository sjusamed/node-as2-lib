const crypto = require('crypto');
const fs = require('fs');

// Sign a message using your private key
function signMessage(payload, privateKeyPath) {
  const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
  const signer = crypto.createSign('SHA256');
  signer.update(payload);
  signer.end();

  const signature = signer.sign(privateKey);

  return signature.toString('base64');  // Return the signature in base64 format
}

module.exports = signMessage;
