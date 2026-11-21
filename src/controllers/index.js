// Route handlers for static pages

// Controller for the home page
const homePage = (req, res) => {
    res.render('index', { title: 'Welcome Home' });
};

// Controller for the appointment page
const appointmentPage = (req, res) => {
    res.render('appointment', { title: 'Make an Appointment' });
};

// Controller for testing error handling
const testErrorPage = (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
};

export { homePage, appointmentPage, testErrorPage };