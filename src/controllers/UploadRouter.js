const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(_dirname, '../public'));
    },
    filename: (request, file, callback) => {
        callback(null, `${request.body.filename}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// Route to handle image uploads
router.post('/upload', upload.single('file'), (request, response) => {
    response.status(200).json({
        message: "File uploaded successfully"
    });
});

module.exports = router;