import express, { RequestHandler } from 'express';
import { joinWaitlist } from '../controllers/user';

const router = express.Router();

/**
 * @route   POST /api/users/join-waitlist
 * @desc    Allows users to join the Rendbit waitlist
 * @access  Public
 */
router.post('/join-waitlist', joinWaitlist);

export default router;