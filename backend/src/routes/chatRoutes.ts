import Router from 'express';
import { body } from 'express-validator';
import { handleChat } from '../controllers';

const router = Router.Router();

/** POST /api/chat - Process a user chat message via Gemini AI */
router.post(
  '/',
  [
    body('message')
      .isString()
      .withMessage('Message must be a string')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ max: 1000 })
      .withMessage('Message must be under 1000 characters')
      .escape(), // Basic sanitization
    body('sessionId').optional().isString().trim().escape(),
  ],
  handleChat
);

export default router;
