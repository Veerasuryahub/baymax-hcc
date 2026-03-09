const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

router.post('/section', auth, chatController.createChatSection);
router.post('/message', auth, chatController.addMessage);
router.get('/history', auth, chatController.getChatHistory);
router.delete('/section/:sectionIndex', auth, chatController.deleteChatSection);

module.exports = router;
