//move to contentvalidators or include in repo

export function checkRatingPrivilege(req, res, next) {
  if (req.body && typeof req.body.rating !== 'undefined') {
    const rating = parseInt(req.body.rating, 10);
    if (!Number.isNaN(rating) && rating > 5) {
      // only admins can set rating values above 5
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'You do not have permission to set that rating' });
      }
    }
  }
  next();
}
