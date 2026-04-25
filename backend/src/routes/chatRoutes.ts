import { Router } from 'express';
import { handleChat } from '../controllers/chatController';

const router = Router();

// Endpoint: POST /api/chat
router.post('/', handleChat);

export default router;
