const crypto = require('crypto');
const fs = require('fs');

// Verify the signature of a message using the sender's public key
function verifySignature(payload, signature, senderPublicKeyPath) {
  const publicKey = fs.readFileSync(senderPublicKeyPath, 'utf-8');
  const verifier = crypto.createVerify('SHA256');
  verifier.update(payload);
  verifier.end();

  return verifier.verify(publicKey, Buffer.from(signature, 'base64'));
}

module.exports = verifySignature;
