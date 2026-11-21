import { Router } from 'express';
import { servicesPage, serviceDetailPage } from './services/services.js';
import { homePage, appointmentPage, testErrorPage } from './index.js';

// Create a new router instance
const router = Router();

// Home and basic pages
router.get('/', homePage);
router.get('/appointment', appointmentPage);

// Course services routes
router.get('/services', servicesPage);
router.get('/services/:serviceId', serviceDetailPage);

// Route to trigger a test error
router.get('/test-error', testErrorPage);

export default router;