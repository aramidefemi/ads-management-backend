// Middleware to check and extract user data from JWT
const checkAuth = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, '818afad8732918ce6c8910939ca903f76a3ecc5fef7ab75e22f9adaaa4c8e9dc');
      req.userData = { userId: decodedToken.userId };
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
  };
  

module.exports = checkAuth;