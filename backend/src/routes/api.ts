import { Router } from 'express';
import { getTimeline, getLocationInfo, getVotingGuide, getFaq } from '../controllers/apiController';

const router = Router();

/** GET /api/health - Service health check */
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'elecguide-api' });
});

/** GET /api/timeline - Election phase timeline */
router.get('/timeline', getTimeline);

/** POST /api/location-info - Polling booth lookup */
router.post('/location-info', getLocationInfo);

/** GET /api/voting-guide - Step-by-step voting guide */
router.get('/voting-guide', getVotingGuide);

/** GET /api/faq - Frequently asked questions */
router.get('/faq', getFaq);

export default router;
