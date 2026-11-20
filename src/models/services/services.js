import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servicesPath = path.join(__dirname, '../../../public/data/services.json');

const servicesArray = JSON.parse(await readFile(servicesPath, 'utf-8'));
const services = Object.fromEntries(
    servicesArray.map(service => [service.id, service])
);

// Model functions that handle all data access

const getAllServices = () => {
    return services;
};

const getServiceById = (serviceId => {
    return services[serviceId] || null;
});

const getSortedPrices = (prices, sortBy) => {
    const sortedPrices = [...prices];
    switch (sortBy) {
        case 'price':
            return sortedPrices.sort((a, b) => b.price - a.price);
        case 'length':
        default:
            return sortedPrices; // Keep original order
    }
};

const getServiceByCategory = () => {
    const category = {};
    Object.values(services).forEach(service => {
        service.category.forEach(category => {
            if (!categories[category]) {
            category[category] = [];
        }
        categories[category].push(service);
        });
    });    
    return categories;
};

export {getAllServices, getServiceById };