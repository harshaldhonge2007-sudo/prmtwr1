"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatRoutes_1 = __importDefault(require("./chatRoutes"));
const apiController_1 = require("../controllers/apiController");
const router = (0, express_1.Router)();
// Modular Routes
router.use('/chat', chatRoutes_1.default);
// Other Endpoints
router.get('/timeline', apiController_1.getTimeline);
router.post('/location-info', apiController_1.getLocationInfo);
router.get('/voting-guide', apiController_1.getVotingGuide);
router.get('/faq', apiController_1.getFaq);
exports.default = router;
