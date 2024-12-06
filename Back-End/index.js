const express = require('express');
const app = express();
const cors = require('cors');

const multer = require('multer');

const crypto = require('crypto');

// //key and initialization vector must match for encryption and decryption
// const algorithm = 'aes-256-cbc';
// const key = crypto.randomBytes(32);
// const iv = crypto.randomBytes(16);

// //encryption
// function encrypt(text){
//     const cipher = crypto.createCipheriv(algorithm, key, iv);
//     const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
//     return {iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')};
// }

// //decryption
// function decrypt(encryptedData, ivHex){
//     const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
//     const decrypted = Buffer.concat([
//         decipher.update(Buffer.from(encryptedData,'hex')),
//         decipher.final()
//     ]);
//     return decrypted.toString('utf8');
// }

// //test encryption and decryption
// const text = "Hello World";
// const encrypted = encrypt(text);
// console.log ("Encrypted: ", encrypted);

// const decrypted = decrypt(encrypted.encryptedData, encrypted.iv);
// console.log ("Decrypted :", decrypted);

//middleware
app.use(cors());
app.use(express.json());

//example route for encryption
app.post('/encrypt', (req, res) => {
    const {text} = req.body;
    if (!text){
        return res.status(400).json({error: 'Text is required'});
    }

    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    res.json({encrypted, key: key.toString('hex'), iv: iv.toString('hex')});
});

app.get('/', (req, res) => {
    res.send('Hello, Backend is running!');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});
