import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import multer from 'multer';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { Storage } from '@google-cloud/storage';
import { Firestore } from '@google-cloud/firestore';
import { existsSync, mkdirSync, promises, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Initialize Firestore
const firestore = new Firestore({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});


// Initialize Google Cloud Storage
const storage = new Storage({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });
const bucketName = process.env.BUCKET_NAME;


// Ensure downloads directory exists
const downloadsDir = join(__dirname, 'downloads');
if (!existsSync(downloadsDir)) {
  mkdirSync(downloadsDir);
}

// Middleware
app.use(cors());
app.use(json());

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
const encryptFile = async (filePath) => {
  const algorithm = 'aes-256-cbc';
  const key = crypto.randomBytes(32);
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
    key: key.toString('hex'),
    iv: iv.toString('hex')
  };
};

const decryptFile = async (filePath, outputFilePath, key, iv) => {
  const algorithm = 'aes-256-cbc';
  const fileContent = await fs.promises.readFile(filePath);
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key,'hex'),
    Buffer.from(iv,'hex')
  );

  const decryptedContent = Buffer.concat([
    decipher.update(fileContent),
    decipher.final(),
  ]);

  await fs.promises.writeFile(outputFilePath,decryptedContent);
};

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

    const fileMetadata = {
      filename: req.file.originalname,
      uploadTimestamp: Firestore.Timestamp.fromDate(new Date()), // Use Firestore Timestamp
      email,
      encryptionKey: key.toString('hex'), // Store encryption key securely
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
      metadata: { id: docRef.id, ...fileMetadata },
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

    const { filename, encryptionKey, iv } = fileDoc.data();
    const encryptedFilePath = path.join(downloadsDir, `${filename}.encrypted`);
    const decryptedFilePath = path.join(downloadsDir, filename);

    await storage
      .bucket(bucketName)
      .file(`uploads/${filename}.encrypted`)
      .download({ destination: encryptedFilePath });

    await decryptFile(encryptedFilePath, decryptedFilePath, encryptionKey, iv);

    res.download(decryptedFilePath, filename, (err) => {
      if (err) {
        console.error('Error sending file to client:', err);
        return res.status(500).json({ success: false, error: 'Failed to send file to client.' });
      }

      fs.unlinkSync(encryptedFilePath);
      fs.unlinkSync(decryptedFilePath);
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
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});

console.log(process.env);
console.log('Environment Variables:', process.env);



// Update: Ensured downloads directory exists, added file download route, and improved temporary file handling.
