import { getAllServices, getServiceById, getSortedPrices } from '../../models/services/services.js';

// Route handler for the services listing page
const servicesPage = (req, res) => {
    const services = getAllServices();

    res.render('services', {
        title: 'Services',
        services: services
    });
};

// Route handler for individual service detail pages
const serviceDetailPage = (req, res, next) => {
    const serviceId = req.params.serviceId;
    const service = getServiceById(serviceId);

    // If service doesn't exist, create 404 error
    if (!service) {
        const err = new Error(`Service ${serviceId} not found`);
        err.status = 404;
        return next(err);
    }

    // Handle sorting if requested
    const sortBy = req.query.sort || 'length';
    const prices = Object.entries(service.price).map(([length, price]) => ({
        length,
        price
    }));

    const sortedPrices = getSortedPrices(prices, sortBy);

    res.render('service-detail', {
        title: service.name,
        service: service,
        sortedPrices: sortedPrices,
        currentSort: sortBy
    });
};

export { servicesPage, serviceDetailPage };