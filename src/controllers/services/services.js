import { getAllServices, getPricesByServiceSlug, getSortedPrices } from '../../models/services/services.js';

// Route handler for the services listing page
const servicesPage = async (req, res) => {
    const services = await getAllServices();

    res.render('services/list', {
        title: 'Services',
        services: services
    });
};

// Route handler for individual service detail pages
const serviceDetailPage = async (req, res, next) => {
    const serviceSlug = req.params.serviceSlug;
    const service = await getPricesByServiceSlug(serviceSlug);

    // If service doesn't exist, create 404 error
    if (!service) {
        const err = new Error(`Service ${serviceSlug} not found`);
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

    res.render('services/detail', {
        title: service.name,
        service: service,
        sortedPrices: sortedPrices,
        currentSort: sortBy
    });
};

export { servicesPage, serviceDetailPage };