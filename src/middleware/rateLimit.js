import {rateLimit} from 'express-rate-limit';

const logInLimiter = rateLimit({
    windowMs: 60*1000, //1min
    limit: process.env.NODE_ENV === 'test' ? 1000 : 3,
    handler: (req, res, next) =>{
        const error = new Error('too many login requests');
        error.status = 429;
        next(error);
    },
});

export default logInLimiter;