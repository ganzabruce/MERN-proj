const express = require('express');
const userRouter = express.Router();
const userControler =  require('../controllers/userControllers');

userRouter.post('/user/register', userControler.signUp);
userRouter.post('/user/login', userControler.loginUser);
userRouter.post('/logout/user',userControler.logoutUser)
userRouter.post('/requestSession',userControler.requestSession)


userRouter.get('/mentors',userControler.getMentors)
module.exports = userRouter;