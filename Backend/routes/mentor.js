const express = require('express');
const mentorRouter = express.Router();
const mentorControllers =  require('../controllers/mentorControllers');

mentorRouter.post('/mentor/register', mentorControllers.signUpMentor);
mentorRouter.post('/mentor/login', mentorControllers.loginMentor);
mentorRouter.post('/logout.mentor',mentorControllers.logoutMentor)
mentorRouter.get('/pendingSessions',mentorControllers.getPendingSessions)

module.exports = mentorRouter;