import express from 'express';
import { joinWaitlist } from '../controllers/user';
import { apiKeyValidator } from '../middlewares/apiKeyValidator';
import { limiter } from '../middlewares/rateLimiter';

const router = express.Router();

/**
 * @route   POST /api/users/join-waitlist
 * @desc    Allows users to join the Rendbit waitlist
 * @access  Public
 */
router.post('/join-waitlist', apiKeyValidator, limiter, joinWaitlist);

export default router;