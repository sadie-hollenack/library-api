export function authorizeOwner(req, res, next) {
    const userId = parseInt(req.params.id);

    if (req.user.role === 'admin' || req.user.id === userId) {
        return next();
    }

    return res.status(403).json({ Error: 'You do not have permission to access this resource' });
}