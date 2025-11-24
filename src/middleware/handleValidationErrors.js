import { validationResult } from 'express-validator';

export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msgs = errors.array().map((err) => err.msg).join(', ');
    return res.status(400).json({ error: msgs });
  }
  next();
}
