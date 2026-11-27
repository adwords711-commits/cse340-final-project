import { Router } from 'express';
import { servicesPage, serviceDetailPage } from './services/services.js';
import { homePage, appointmentPage, testErrorPage } from './index.js';

// Create a new router instance
const router = Router();

// Services specific styles to all services routes
router.use((req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/styles.css">');
    res.addStyle('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">');

    res.addScript('<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>');
    res.addScript('<script type="module" src="/js/main.js"></script>');
    
    next();
});

// Home and basic pages
router.get('/', homePage);
router.get('/appointment', appointmentPage);

// Course services routes
router.get('/services', servicesPage);
router.get('/services/:serviceSlug', serviceDetailPage);

// Route to trigger a test error
router.get('/test-error', testErrorPage);

export default router;