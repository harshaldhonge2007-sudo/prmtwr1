import { Router } from 'express';
import chatRoutes from './chatRoutes';
import { getTimeline, getLocationInfo, getVotingGuide, getFaq } from '../controllers/apiController';

const router = Router();

// Modular Routes
router.use('/chat', chatRoutes);

// Other Endpoints
router.get('/timeline', getTimeline);
router.post('/location-info', getLocationInfo);
router.get('/voting-guide', getVotingGuide);
router.get('/faq', getFaq);

export default router;
