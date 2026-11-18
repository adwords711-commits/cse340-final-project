/**
 * Import libraries
 */

import express from 'express';
import path from 'path';
//import { title } from 'process';
import { fileURLToPath } from 'url';
import { readFile } from 'node:fs/promises'; // Reads services.json file asynchronously

/**
 * declare important variables
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const services = JSON.parse(  // Convert the JSON text into a JavaScript array
    await readFile( // read the file
        path.join(__dirname, 'public/data/services.json'),  // Locate services.json
        'utf-8' // rea its content as text
    )
);
const servicesById = Object.fromEntries(  // Create an object indexed by service id
        services.map(service => [service.id, service]) // convert each service into and Id-valud pair
);

// Create an instance of an Express application
const app = express();

/**
 * Configure Express middleware
 */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Global template variables middleware
 * 
 * Makes common variables available to all EJS templates without having to pass
 * them individually from each route handler
 */
app.use((req, res, next) => {
    // Make NODE_ENV available to all templates
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';

    // Continue to the next middleware or route handler
    next();
});

/**
 * Routes
 */
app.get('/', (req, res) => {
    const title = 'Welcome Home';
    res.render('index', { title});
});

app.get('/services', (req, res) => {
    const title = 'Services';
    res.render('services', { title });
});

// Enhanced service detail route with sorting
app.get('/services/:serviceId', (req, res, next) => {
    const serviceId = req.params.serviceId;
    const service = servicesById[serviceId];

    if (!service) {
        const err = new Error(`Service ${serviceId} not found`);
        err.status = 404;
        return next(err);
    }

    // Get sort parameter (default to 'time')
    const sortBy = req.query.sort || 'length';

    // Create a copy of sections to sort
    let sortedPrices = Object.entries(service.price).map(([length, price]) => ({
        length,
        price
    }));

    // Sort based on the parameter
    switch (sortBy) {
        case 'price':
            sortedPrices.sort((a, b) => b.price - a.price);
            break;
        case 'length':
        default:
            // Keep original time order as default
            break;
    }

    console.log(`Viewing service: ${serviceId}, sorted by: ${sortBy}`);

    res.render('service-detail', {
        title: service.name,
        service: service,
        sortedPrices: sortedPrices,
        currentSort: sortBy
    });
});

app.get('/appointment', (req, res) => {
    const title = 'Make an Appointment';
    res.render('appointment', { title });
});

/**
 * Error Handling
 */

// Test route for 500 errors
app.get('/test-error', (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
});

/// Catch-all route for 404 errors
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    // Prevent infinite loops, if a response has already been sent, do nothing
    if (res.headersSent || res.finished) {
        return next(err);
    }

    // Determine status and template
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    // Prepare data for the template
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: NODE_ENV === 'production' ? 'An error occurred' : err.message,
        stack: NODE_ENV === 'production' ? null : err.stack,
        NODE_ENV // Our WebSocket check needs this and its convenient to pass along
    };

    // Render the appropriate error template with fallback
    try {
        res.status(status).render(`errors/${template}`, context);
    } catch (renderErr) {
        // If rendering fails, send a simple error page instead
        if (!res.headersSent) {
            res.status(status).send(`<h1>Error ${status}</h1><p>An error occurred.</p>`);
        }
    }
});

// When in development mode, start a WebSocket server for live reloading
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});