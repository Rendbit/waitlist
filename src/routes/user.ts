import express from 'express';
import { joinWaitlist } from '../controllers/user';
import { apiKeyValidator } from '../middlewares/apiKeyValidator';
import { limiter } from '../middlewares/rateLimiter';

const router = express.Router();

/**
 * @route   POST /waitlist-api/user/join
 * @desc    Allows users to join the Rendbit waitlist
 * @access  Public
 */
router.post('/join', apiKeyValidator, limiter, joinWaitlist);

export default router;