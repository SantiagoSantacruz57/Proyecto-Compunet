const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 7000;

// Configure multer to use custom filename and destination
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/resources/productImages'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Endpoint to handle product addition
app.post('/api/addProduct', upload.single('productImage'), (req, res) => {
    const product = {
        name: req.body.productName,
        price: parseFloat(req.body.productPrice),
        image: req.file.filename, // Use the new filename with unique suffix
        rating: req.body.productRating
    };

    const productsPath = path.join(__dirname, '..', 'public', 'resources', 'products.json');

    fs.readFile(productsPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading products file:', err);
            return res.json({ success: false, error: err });
        }

        const products = JSON.parse(data);
        products.push(product);

        fs.writeFile(productsPath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                console.error('Error saving products file:', err);
                return res.json({ success: false, error: err });
            }

            res.json({ success: true });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
