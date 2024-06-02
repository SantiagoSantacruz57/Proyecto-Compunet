const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT =5000;
const upload = multer({ dest: '../public/resources/productImages/' });


// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/api/addProduct', upload.single('productImage'), (req, res) => {
    const product = {
        name: req.body.productName,
        price: req.body.productPrice,
        image: req.file.filename, // Change this to req.file.originalname if you want the original file name
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