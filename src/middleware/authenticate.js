import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

export function authenticate (req, res, next) {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')) {
        const error = new Error('not authenticated');
        error.status = 401;
        return next(error);
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = {id: payload.id, role: payload.role};
        next();
    } catch (err) {
        const error = new Error('not authenticated');
        error.status = 401;
        return next(error);
    }
    
}