import Router from 'express';
import { handleChat } from '../controllers/chatController';

const router = Router.Router();

/** POST /api/chat - Process a user chat message via Gemini AI */
router.post('/', handleChat);

export default router;
