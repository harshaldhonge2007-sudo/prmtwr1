"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = require("../controllers/chatController");
const router = (0, express_1.Router)();
// Endpoint: POST /api/chat
router.post('/', chatController_1.handleChat);
exports.default = router;
