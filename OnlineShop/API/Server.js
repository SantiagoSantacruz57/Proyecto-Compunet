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
    const productsFilePath = path.join(__dirname, '..', 'public', 'resources', 'products.json');

    const newProduct = {
        name: req.body.productName,
        price: parseFloat(req.body.productPrice),
        image: req.file.filename
    };

    fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading products file:', err);
            return res.status(500).json({ success: false, message: 'Error reading products file' });
        }

        let products = [];
        if (data) {
            try {
                products = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing products file:', parseErr);
                return res.status(500).json({ success: false, message: 'Error parsing products file' });
            }
        }

        products.push(newProduct);

        fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                console.error('Error saving product:', err);
                return res.status(500).json({ success: false, message: 'Error saving product' });
            }

            res.json({ success: true, message: 'Product added successfully' });
        });
    });
});

// Route to handle order submissions
app.post('/api/saveOrder', (req, res) => {
    const newOrder = req.body;
    const ordersFilePath = path.join(__dirname, '../public', 'resources', 'orders.json');

    fs.readFile(ordersFilePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading orders file:', err);
            return res.status(500).json({ success: false, message: 'Error reading orders file' });
        }

        let orders = [];
        if (data) {
            try {
                orders = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing orders file:', parseErr);
                return res.status(500).json({ success: false, message: 'Error parsing orders file' });
            }
        }

        if (!Array.isArray(orders)) {
            orders = [];
        }

        orders.push(newOrder);

        fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), (err) => {
            if (err) {
                console.error('Error saving order:', err);
                return res.status(500).json({ success: false, message: 'Error saving order' });
            }

            res.json({ success: true, message: 'Order saved successfully' });
        });
    });
});





app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
