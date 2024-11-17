const rawBodyMiddleware = (req, res, next) => {
    req.rawBody = req.body; // Store the raw body for signature verification
    console.log('Raw body captured:', req.body);  // Added log to capture the raw body
    next();
  };
  
  module.exports = { rawBodyMiddleware };
  