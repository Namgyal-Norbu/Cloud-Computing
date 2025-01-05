const express = require('express');
const cors = require('cors');
const multer = require('multer');
const crypto = require('crypto');
const { Storage } = require('@google-cloud/storage');
const { Firestore } = require('@google-cloud/firestore');
const fs = require('fs');
const path = require('path');

const app = express();

// Initialize Firestore
const firestore = new Firestore({
  projectId: 'awesome-flash-444017-g4',
  keyFilename: './newkey.json',
});

// Initialize Google Cloud Storage
const storage = new Storage({ keyFilename: './newkey.json' });
const bucketName = 'encrypted-files-storage';

// Ensure downloads directory exists
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir);
}

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file uploads (temporary local storage)
const upload = multer({ dest: 'uploads/' });

// Test Firestore connection
app.get('/test-firestore', async (req, res) => {
  try {
    const testDoc = await firestore.collection('test-collection').add({ test: 'connection' });
    res.send(`Test document created with ID: ${testDoc.id}`);
  } catch (error) {
    console.error('Firestore connection test failed:', error);
    res.status(500).send('Firestore connection failed.');
  }
});

//file encryption
const encryptFile = async (filePath, password) => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.createHash('sha256').update(password).digest('base64').substr(0,32); //derive key from password
  const iv = crypto.randomBytes(16);

  const fileContent = await fs.promises.readFile(filePath);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encryptedContent = Buffer.concat([
    cipher.update(fileContent),
    cipher.final()
  ]);
  
  const encryptedPath = `${filePath}.encrypted`;
  await fs.promises.writeFile(encryptedPath, encryptedContent);
  
  return {
    encryptedPath,
    iv: iv.toString('hex')
  };
};

// Decrypt file function
const decryptFile = async (filePath, password, ivHex) => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.createHash('sha256').update(password).digest('base64').substr(0, 32); // Derive key from password
  const iv = Buffer.from(ivHex, 'hex');

  const fileContent = await fs.promises.readFile(filePath);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decryptedContent = Buffer.concat([
    decipher.update(fileContent),
    decipher.final()
  ]);

  const decryptedPath = filePath.replace('.encrypted', '.decrypted');
  await fs.promises.writeFile(decryptedPath, decryptedContent);

  return decryptedPath;
};

// API Route: Decrypt file
app.post('/decrypt', upload.single('file'), async (req, res) => {
  const { password } = req.body;

  if (!req.file || !password) {
    return res.status(400).json({ success: false, error: 'File and password are required.' });
  }

  try {
    //normalize filename (remove 'uploads_' prefix if present)
    const normalizedFilename = req.file.originalname.replace(/^uploads_/, '');

    // Fetch file metadata from Firestore
    const snapshot = await firestore
      .collection('uploads')
      .where('filename', '==', normalizedFilename)
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.error('No metadata found for file:', normalizedFilename);
      return res.status(404).json({ success: false, error: 'File metadata not found.' });
    }

    const metadata = snapshot.docs[0].data();
    const iv = metadata.iv;

    if (!iv) {
      console.error('IV not found in file metadata.');
      return res.status(400).json({ success: false, error: 'IV not found in metadata.' });
    }

    // Decrypt file
    const decryptedPath = await decryptFile(req.file.path, password, iv);

    // Serve decrypted file for download
    res.download(decryptedPath, normalizedFilename.replace('.encrypted', ''), (err) => {
      if (err) {
        console.error('Error sending decrypted file:', err);
        return res.status(500).json({ success: false, error: 'Failed to send decrypted file.' });
      }

      // Clean up temporary files
      fs.unlink(req.file.path, () => {});
      fs.unlink(decryptedPath, () => {});
    });
  } catch (error) {
    console.error('Error during file decryption:', error);
    res.status(500).json({ success: false, error: 'Failed to decrypt file.' });
  }
});

// API route: Upload file to Google Cloud Storage and Firestore
app.post('/upload', upload.single('file'), async (req, res) => {
  const { email, password } = req.body;

  if (!req.file || !email || !password) {
    return res.status(400).json({ success: false, error: 'File, email, and password are required.' });
  }

  try {
    //encrypt file
    const { encryptedPath, iv } = await encryptFile(req.file.path, password);
    const destination = `uploads/${req.file.originalname}.encrypted`;

    // Upload encrypted file to cloud storage
    await storage.bucket(bucketName).upload(encryptedPath, { destination });

    const fileMetadata = {
      filename: req.file.originalname,
      uploadTimestamp: Firestore.Timestamp.fromDate(new Date()),
      email,
      iv: iv.toString('hex'),             // Store IV securely
      url: `https://storage.googleapis.com/${bucketName}/${destination}`,
    };

    // Add Firestore document with enhanced logging
    const docRef = await firestore.collection('uploads').add(fileMetadata);
    console.log('File metadata saved with ID:', docRef.id);

    fs.unlinkSync(req.file.path);
    fs.unlinkSync(encryptedPath);

    res.json({
      success: true,
      message: 'File uploaded successfully!',
      metadata: {id: docRef.id, filename: fileMetadata.filename}
    });
  } catch (error) {
    console.error('Error during Firestore operation:', error);
    res.status(500).json({ success: false, error: 'Failed to upload file.' });
  }
});


// API route: Fetch files associated with a user's email
app.get('/fetch-files', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required.' });
  }

  try {
    const snapshot = await firestore.collection('uploads').where('email', '==', email).get();

    if (snapshot.empty) {
      console.log('No files found for email:', email);
      return res.json({ success: true, files: [] });
    }

    const files = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log(`Fetched ${files.length} files for email: ${email}`);
    res.json({ success: true, files });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch files.' });
  }
});


// API route: Download a file from Google Cloud Storage
app.get('/download-file', async (req, res) => {
  const { filename } = req.query;

  if (!filename) {
    console.error('No filename provided in request.');
    return res.status(400).json({ success: false, error: 'Filename is required.' });
  }

  try {
    const tempFilePath = path.join(downloadsDir, filename);
    console.log(`Attempting to download file: uploads/${filename}`);

    // Check if the file exists in the bucket
    const fileExists = await storage.bucket(bucketName).file(`uploads/${filename}`).exists();
    if (!fileExists[0]) {
      console.error(`File not found in bucket: uploads/${filename}`);
      return res.status(404).json({ success: false, error: 'File not found in bucket.' });
    }

    // Download the file to a temporary location
    await storage.bucket(bucketName).file(`uploads/${filename}`).download({ destination: tempFilePath });
    console.log(`File downloaded successfully to: ${tempFilePath}`);

    // Serve the file for download
    res.download(tempFilePath, filename, (err) => {
      if (err) {
        console.error('Error sending file to client:', err);
        return res.status(500).json({ success: false, error: 'Failed to send file to client.' });
      }

      // Clean up the temporary file after the download
      fs.unlink(tempFilePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting temporary file:', unlinkErr);
        }
      });
    });
  } catch (error) {
    console.error('Error in /download-file route:', error);
    res.status(500).json({ success: false, error: 'Failed to download file.' });
  }
});


// Default route
app.get('/', (req, res) => {
  res.send('Hello, Backend is running!');
});

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});