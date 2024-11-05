import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({
      message: 'Access Denied',
      status: 403
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: 'Invalid Token',
        status: 401
      });
    }
    req.role = decoded.role; // Save decoded token data in request
    next();
  });
};

export const verifyRole = (role) => {
  return (req, res, next) => {
    if (req.role !== role) {
      return res.status(403).json({
        message: 'Access Denied',
        status: 403
      });
    }
    next();
  };
};
