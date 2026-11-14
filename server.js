/**
 * Import libraries
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * declare important variables
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;


// Create an instance of an Express application
const app = express();

/**
 * Configure Express middleware
 */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/index.html'));
});

app.get('/services.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/services.html'));
});

app.get('/appointment.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/appointment.html'));
});
app.get('/new', (req, res) => {
    res.send('This is a new route!');
});


// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});