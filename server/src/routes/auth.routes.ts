import { Router } from 'express';
import {
  checkUserSignupObjectValid,
  checkUserSigninObjectValid,
} from '../middleware/auth.middleware';
import {
  requestPasswordResetController,
  resetPasswordController,
  signinUserController,
  signupUserController,
  verifyEmailController,
} from '../controllers/auth.controller';
import { checkUserPasswordUpdateObjectValid } from '../middleware/user.middleware';

export const authRouter = Router();

// user signup
authRouter.post('/signup', checkUserSignupObjectValid, signupUserController);

// user signin
authRouter.post('/signin', checkUserSigninObjectValid, signinUserController);

// user verify email address
authRouter.post('/email/verify/:id/:token', verifyEmailController);

// request password reset
authRouter.post('/password/reset', requestPasswordResetController);

// reset password
authRouter.put(
  '/password/reset/:userId/:token',
  checkUserPasswordUpdateObjectValid,
  resetPasswordController
);
