import prisma from '../config/db.js';

export function authorizeOwner(req, res, next) {
    const userId = parseInt(req.params.id, 10);

    if (req.user && (req.user.role === 'admin' || req.user.id === userId)) {
        return next();
    }

    return res.status(403).json({ Error: 'You do not have permission to access this resource' });
}

export async function ensureReviewOwner(req, res, next) {
    const id = parseInt(req.params.id, 10);
    const review = await prisma.review.findUnique({ where: { review_id: id } });
    if (!review) return res.status(404).json({ Error: 'Could not find a review with that ID' });
    if (req.user && req.user.id === review.user_id) return next();
    return res.status(403).json({ Error: 'You do not have permission to access this resource' });
}

export async function ensureReviewOwnerOrAdmin(req, res, next) {
    const id = parseInt(req.params.id, 10);
    const review = await prisma.review.findUnique({ where: { review_id: id } });
    if (!review) return res.status(404).json({ Error: 'Could not find a review with that ID' });
    if (req.user && (req.user.role === 'admin' || req.user.id === review.user_id)) return next();
    return res.status(403).json({ Error: 'You do not have permission to access this resource' });
}