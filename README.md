
# Node.js AS2 Communication Library

## Overview

This project implements an AS2 (Applicability Statement 2) communication system in Node.js, enabling secure transmission of EDI documents over HTTP. It features:

- **AES-256 encryption** for secure message content.
- **RSA key encryption** for securely transmitting the AES key.
- **MDN (Message Disposition Notification)** processing with optional signature verification.
- Flexibility to **toggle MDN signature verification** on or off as required.

## Table of Contents
1. [Project Structure](#project-structure)
2. [How It Works](#how-it-works)
3. [Getting Started](#getting-started)
4. [Message Encryption and Transmission](#message-encryption-and-transmission)
5. [MDN Handling](#mdn-handling)
6. [Configuration Options](#configuration-options)
7. [Running the Project](#running-the-project)
8. [Future Improvements](#future-improvements)

---

## Project Structure

The key files and directories in this project are as follows:

```
project-root/
│
├── certs/
│   ├── recipient_public_key.pem      # Public key for RSA encryption (client-side)
│   ├── recipient_private_key.pem     # Private key for RSA decryption and MDN signing (server-side)
│
├── src/
│   ├── receiveAs2Message.js          # AS2 server-side logic (receives and decrypts messages, sends MDNs)
│   ├── sendAs2Message.js             # AS2 client-side logic (encrypts and sends messages, handles MDNs)
│
├── test/
│   ├── test-as2-functions.js         # Test script for sending AS2 messages and processing responses
│
├── README.md                         # This file
```

---

## How It Works

### 1. **Encryption and Decryption**
The AS2 message is encrypted using AES-256, and the AES key is further encrypted using RSA (with the recipient’s public key). This ensures the message and key are transmitted securely.

- **Client Side**: The message is encrypted before transmission.
- **Server Side**: The AES key is decrypted using RSA, and the message is then decrypted using AES.

### 2. **MDN (Message Disposition Notification)**
The receiver of the AS2 message sends back an MDN to acknowledge receipt and processing of the message.

- **Signed MDN**: The server can sign the MDN using its private key to prove authenticity.
- **MDN Verification**: The client can verify the MDN signature using the recipient’s public key, ensuring the message was processed by the correct recipient.

---

## Getting Started

### Prerequisites
1. **Node.js**: Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
2. **Certificates**: Place the necessary public and private keys in the `certs/` directory.
    - `recipient_public_key.pem`: The recipient's public key, used for encrypting the AES key.
    - `recipient_private_key.pem`: The recipient's private key, used for decrypting the AES key and signing MDNs.

### Installation

1. Clone this repository:
   ```bash
   git clone <repo-url>
   cd node-as2-lib
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## Message Encryption and Transmission

### Client Side (`sendAs2Message.js`)
The AS2 message is encrypted with AES-256, and the AES key is encrypted with RSA. The encrypted message, AES key, and initialization vector (IV) are sent to the recipient.

```javascript
const { encryptedMessage, encryptedAesKey, iv } = encryptMessage(plainMessage);
```

### Server Side (`receiveAs2Message.js`)
Upon receiving the message, the server decrypts the AES key using RSA, then decrypts the message using the AES key.

```javascript
const decryptedMessage = decryptMessage(encryptedMessage, encryptedAesKey, iv);
```

---

## MDN Handling

After processing the AS2 message, the server sends an MDN back to the client. This MDN can be **signed** using the recipient's private key, and the client can choose whether to verify the signature.

### MDN Signature Verification (Client)
- The MDN response is parsed, and the signature (if present) is verified using the recipient’s public key.
- You can toggle MDN signature verification by setting the `requireMdnSignature` flag.

```javascript
const requireMdnSignature = true;  // Set to false to skip signature verification
```

### MDN Generation (Server)
The MDN can be optionally signed on the server side using the recipient’s private key before being sent back to the client.

```javascript
const signer = crypto.createSign('SHA256');
signer.update(mdnBody);
const mdnSignature = signer.sign(privateKey).toString('base64');
```

---

## Configuration Options

### 1. **MDN Signature Verification Toggle**
You can toggle MDN signature verification on or off by modifying the `requireMdnSignature` flag in `sendAs2Message.js`:

```javascript
const requireMdnSignature = true;  // Enable or disable MDN signature verification
```

### 2. **Certificates**
Place your RSA keys in the `certs/` folder:
- **recipient_public_key.pem**: Used for encrypting the AES key (client-side) and verifying MDN signatures.
- **recipient_private_key.pem**: Used for decrypting the AES key (server-side) and signing MDNs.
