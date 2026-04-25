import { Router } from 'express';
import { handleChat, getTimeline, getLocationInfo, getVotingGuide, getFaq } from '../controllers/apiController';

const router = Router();

router.post('/chat', handleChat);
router.get('/timeline', getTimeline);
router.post('/location-info', getLocationInfo);
router.get('/voting-guide', getVotingGuide);
router.get('/faq', getFaq);

export default router;
