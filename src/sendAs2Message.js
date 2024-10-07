const axios = require('axios');
const fs = require('fs');
const crypto = require('crypto');

// Toggle to enable/disable MDN signature verification
const requireMdnSignature = true;  // Set to false to skip signature verification

// Encrypt the message with AES and then encrypt the AES key with RSA
function encryptMessage(plainMessage) {
  // Generate a random AES key
  const aesKey = crypto.randomBytes(32); // 32 bytes = 256-bit key for AES-256

  // Encrypt the message using AES
  const iv = crypto.randomBytes(16); // Initialization vector for AES
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
  let encryptedMessage = cipher.update(plainMessage, 'utf8', 'base64');
  encryptedMessage += cipher.final('base64');

  // Encrypt the AES key using the recipient's public key (RSA)
  const recipientPublicKey = fs.readFileSync('./certs/recipient_public_key.pem', 'utf-8');
  const encryptedAesKey = crypto.publicEncrypt(recipientPublicKey, aesKey);

  return {
    encryptedMessage,
    encryptedAesKey: encryptedAesKey.toString('base64'),
    iv: iv.toString('base64') // Include the IV to be sent along with the encrypted message
  };
}

// Send the AS2 message and handle the MDN
async function sendAs2Message(plainMessage, recipientUrl) {
  const { encryptedMessage, encryptedAesKey, iv } = encryptMessage(plainMessage);

  const payload = {
    encryptedMessage,
    encryptedAesKey,
    iv
  };

  try {
    // Send the AS2 message (with AES-encrypted content and RSA-encrypted AES key)
    const response = await axios.post(recipientUrl, payload, {
      headers: {
        'AS2-From': 'my-as2-id',
        'AS2-To': 'partner-as2-id',
        'Content-Type': 'application/json',
        'User-Agent': 'My AS2 Client'
      }
    });

    console.log('AS2 message sent successfully.');
    console.log('Full MDN Response:', response.data);

    // Split MDN into body and signature parts
    const [mdnBody, mdnSignature] = response.data.split('\n\n');

    // Log the parsed MDN body and signature
    console.log('MDN Body:', mdnBody);
    console.log('MDN Signature:', mdnSignature);

    // Ensure the MDN body exists
    if (!mdnBody) {
      throw new Error('MDN body is missing.');
    }

    // Check if signature verification is required
    if (!requireMdnSignature || !mdnSignature) {
      if (!requireMdnSignature) {
        console.log('MDN signature verification is disabled. Proceeding without verification.');
      } else {
        console.log('MDN signature is missing. Proceeding without verification.');
      }
    } else {
      // Load the public key to verify the MDN signature
      const publicKey = fs.readFileSync('./certs/recipient_public_key.pem', 'utf-8');

      // Verify the signature
      const verifier = crypto.createVerify('SHA256');
      verifier.update(mdnBody);
      const isValid = verifier.verify(publicKey, Buffer.from(mdnSignature, 'base64'));

      if (isValid) {
        console.log('MDN signature is valid.');
      } else {
        console.log('MDN signature verification failed.');
      }
    }

  } catch (error) {
    console.error('Error sending AS2 message or verifying MDN:', error);
  }
}

module.exports = sendAs2Message;
