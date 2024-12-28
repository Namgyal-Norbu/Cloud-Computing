const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const crypto = require('crypto');
const { Storage } = require('@google-cloud/storage'); // Import Google Cloud Storage

const storage = new Storage({ keyFilename: './Back-End/newkey.json' });
const bucketName = 'encrypted-files-storage'; // Replace with your bucket name

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' }); // Temporary local storage for uploads

// API route: Upload file to Google Cloud Storage
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'File is required' });
    }

    try {
        const filePath = req.file.path;
        const destination = `uploads/${req.file.originalname}`;

        // Upload file to Google Cloud Storage
        await storage.bucket(bucketName).upload(filePath, {
            destination, // Specify where the file will be saved in the bucket
        });

        res.json({ message: 'File uploaded successfully!', path: destination });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

// Example encryption route (existing)
app.post('/encrypt', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    res.json({ encrypted, key: key.toString('hex'), iv: iv.toString('hex') });
});


app.get('/', (req, res) => {
    res.send('Hello, Backend is running!');
});


const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});

app.get('/test-bucket', async (req, res) => {
    try {
        const [buckets] = await storage.getBuckets();
        res.json({ buckets: buckets.map(bucket => bucket.name) });
    } catch (error) {
        console.error('Error accessing GCS:', error);
        res.status(500).json({ error: 'Failed to access GCS' });
    }
});