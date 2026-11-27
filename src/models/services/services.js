import db from '../db.js';

/**
 * Gets all services and their associated prices from the database.
 * Array of service and price rows
 * @returns {Promise<Array>}
 */

// Retrieves all services with their associated prices
const getAllServices = async () => {
    const query = `
        SELECT s.*, sp.hair_length, sp.price
        FROM services s
        JOIN service_prices sp ON s.id = sp.service_id
        ORDER BY s.id, sp.id
    `;
    // Executes the database query
    const result = await db.query(query);

    // Groups database rows by service
    const services = {};

    result.rows.forEach(row => {
        if (!services[row.id]) {
            services[row.id] = {
                id: row.slug,
                name: row.name,
                category: [row.category],
                description: row.description,
                duration: `${row.duration} min`,
                image: row.image,
                price: {}
            };
        }
        // Adds the price for each hair lenght
        services[row.id].price[row.hair_length] = Number(row.price);
    });
    // Returns the query results
    return Object.values(services);
};

/**
 * Core function that gets all prices for a specific service.
 * Works with either service ID or slug.
 * @param {string|number} identifier - Service ID or slug
 * @param {string} identifierType - 'id' or 'slug' (default: 'slug')
 * @returns {Promise<Object|null>} Service object with prices, or null if not found
 */
const getPricesByService = async (identifier, identifierType = 'slug') => {
    // Build WHERE clause dynamically based on whether we're searching by ID or slug
    // Using $1 prevents SQL injection - never concatenate user input into SQL!
    const whereClause = identifierType === 'id' ? 's.id = $1' : 's.slug = $1';
    
    
    /**
     * Join services with service_prices to get complete service information.
     * Note: The service_prices table stores the different prices for each hair length.
     */
    const query = `
        SELECT s.*, sp.hair_length, sp.price
        FROM services s
        JOIN service_prices sp ON s.id = sp.service_id
        WHERE ${whereClause}
        ORDER BY sp.id
    `;
    // Executes the query using the identifier as a paramenter
    const result = await db.query(query, [identifier]);

    // Returns null if the service is not found
    if (result.rows.length === 0) return null;

    // Creates one service object from the database rows
    const service = {
        id: result.rows[0].slug,
        name: result.rows[0].name,
        category: [result.rows[0].category],
        description: result.rows[0].description,
        duration: `${result.rows[0].duration} min`,
        image: result.rows[0].image,
        price: {}        
    };

    result.rows.forEach(row => {
        // Adds each hair length price
        service.price[row.hair_length] = Number(row.price);
    });

    // Returns the matching service price rows
    return service;
};
    

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

/**
 * Wrapper functions maintain a simple API while using the core function internally.
 * These allow us to retrieve service prices using a service slug.
 * Example: getpricesBySlug('balayage') calls getPricesByService('balayage', 'slug')
 */
const getPricesByServiceSlug = (serviceSlug) => 
    getPricesByService(serviceSlug, 'slug');

export {
    getAllServices, 
    getPricesByServiceSlug,
    getSortedPrices};