import express, { Router } from 'express';
import validateBody from '../helpers/validateBody.js';
import authenticate from '../middlewares/authenticate.js';
import schemas from '../schemas/authSchemas.js';
import authControllers from '../controllers/authControllers.js';
import upload from '../middlewares/upload.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(schemas.registerSchema), authControllers.register);
authRouter.get('/verify/:verificationToken', authControllers.verifyEmail);
authRouter.post('/verify', validateBody(schemas.emailSchema),authControllers.resendVerifyEmail);
authRouter.post('/login', validateBody(schemas.loginSchema), authControllers.login);
authRouter.get('/current', authenticate, authControllers.getCurrent);
authRouter.post('/logout', authenticate, authControllers.logout);
authRouter.patch('/avatars', authenticate, upload.single('avatar'), authControllers.updateAvatar)

export default authRouter;



