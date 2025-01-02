const express = require('express');
const cors = require('cors');
const multer = require('multer');
const crypto = require('crypto');
const { Storage } = require('@google-cloud/storage');
const { Firestore } = require('@google-cloud/firestore');

const app = express();

// Initialize Firestore
const firestore = new Firestore({
  projectId: 'awesome-flash-444017-g4',
  keyFilename: './newkey.json', // Ensure this path is correct
});

// Initialize Google Cloud Storage
const storage = new Storage({ keyFilename: './newkey.json' });
const bucketName = 'encrypted-files-storage'; 

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file uploads (temporary local storage)
const upload = multer({ dest: 'uploads/' });

// API route: Upload file to Google Cloud Storage and Firestore
app.post('/upload', upload.single('file'), async (req, res) => {
  const { email, password } = req.body;

  if (!req.file || !email || !password) {
    return res.status(400).json({ success: false, error: 'File, email, and password are required.' });
  }

  try {
    const filePath = req.file.path;
    const destination = `uploads/${req.file.originalname}`;

    // Encrypt file content (mock encryption)
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedContent = cipher.update('Sample content', 'utf8', 'hex');
    encryptedContent += cipher.final('hex');

    // Upload file to Google Cloud Storage
    await storage.bucket(bucketName).upload(filePath, {
      destination,
    });

    // Save file metadata to Firestore
    const fileMetadata = {
      filename: req.file.originalname,
      uploadTimestamp: new Date(),
      email,
      encryptionKey: key.toString('hex'),
      iv: iv.toString('hex'),
    };

    const docRef = await firestore.collection('uploads').add(fileMetadata);

    res.json({
      success: true,
      message: 'File uploaded successfully!',
      metadata: { id: docRef.id, ...fileMetadata },
    });
  } catch (error) {
    console.error('Error during upload or Firestore operation:', error);
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
      return res.json({ success: true, files: [] });
    }

    const files = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, files });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch files.' });
  }
});

// Example encryption endpoint (for text encryption testing)
app.post('/encrypt', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, error: 'Text is required.' });
  }

  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    res.json({
      success: true,
      encrypted,
      key: key.toString('hex'),
      iv: iv.toString('hex'),
    });
  } catch (error) {
    console.error('Error during encryption:', error);
    res.status(500).json({ success: false, error: 'Failed to encrypt text.' });
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
