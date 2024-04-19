import { NextFunction, Request, Response } from 'express';
import {
  SigninUserType,
  SignupUserType,
  UserPasswordUpdateType,
} from '../models/user.model';
import { prismaDB } from '..';
import {
  comparePassword,
  createJwtToken,
  hashPassword,
} from '../utils/auth.utils';
import { pick } from 'lodash';
import emailService from '../services/email.service';
import randomstring from 'randomstring';
import { JsonApiResponse } from '../constant.types';
import { isValidUuid } from '../utils/index.utils';

// POST /signup
export async function signupUserController(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { user }: { user: SignupUserType } = req.body;

    // check if user already exists in db
    const userExists = await prismaDB.user.findUnique({
      where: { email: user.email },
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already registered',
      });
    }

    // user exists, create password hash
    const hash = await hashPassword(user.password);

    const randomString = randomstring.generate();

    const newUser = await prismaDB.user.create({
      data: {
        ...user,
        password: hash,
        emailVerificationString: randomString,
        profile: {
          create: {
            avatarUrl: null,
            username: user.email,
          },
        },
        preferences: {
          create: {
            theme: 'system',
            weightUnit: 'kg',
          },
        },
      },
      include: {
        profile: true,
        preferences: true,
      },
    });

    // generate token
    const token = createJwtToken(newUser.id);

    res.status(200).json({
      success: true,
      data: {
        ...pick(newUser, [
          'name',
          'email',
          'id',
          'emailVerified',
          'profile',
          'preferences',
        ]),
        token,
      },
    });

    // send verification email
    const verificationEmailMessage = await emailService.sendEmailVerification({
      email: newUser.email,
      id: newUser.id,
      name: newUser.name,
      randomString,
    });

    return;
  } catch (err) {
    console.error(err);

    next(err);
  }
}

// POST /signin
export async function signinUserController(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { user }: { user: SigninUserType } = req.body;

    // check if user exists in db before checking password
    const userExists = await prismaDB.user.findUnique({
      where: { email: user.email },
      include: { profile: true, preferences: true },
    });

    if (!userExists) {
      return res
        .status(401)
        .json({ success: false, error: 'Incorrect details, please try again' });
    }

    // compare passwords
    const passwordCheck = await comparePassword(
      user.password,
      userExists.password
    );

    if (!passwordCheck) {
      return res
        .status(401)
        .json({ success: false, error: 'Incorrect details, please try again' });
    }

    // generate token
    const token = createJwtToken(userExists.id);

    return res.status(200).json({
      success: true,
      data: {
        ...pick(userExists, [
          'name',
          'email',
          'id',
          'emailVerified',
          'profile',
          'preferences',
        ]),
        token,
      },
    });
  } catch (err) {
    console.error(err);

    next(err);
  }
}

// POST /email/verify/:id/:token
export async function verifyEmailController(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { id, token }: { id?: string; token?: string } = req.params;

    if (!id || !token) {
      return res
        .status(400)
        .json({ success: false, error: 'No ID or token provided' });
    }

    if (!isValidUuid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID' });
    }

    const user = await prismaDB.user.findUnique({ where: { id } });

    if (user) {
      if (user.emailVerified) {
        return res.status(200).json({ success: true });
      }

      if (user.emailVerificationString === token) {
        await prismaDB.user.update({
          where: { id },
          data: { emailVerified: true, emailVerificationString: null },
        });

        res.status(200).json({ success: true });

        // send email verified email
        const verifiedEmailMessage = await emailService.sendEmailVerified({
          email: user.email,
          name: user.name,
        });

        return;
      }
    }

    return res.status(400).json({
      success: false,
      error: 'Invalid request',
    });
  } catch (err) {
    console.error(err);

    next(err);
  }
}

// POST /password/reset?email=userEmail
export async function requestPasswordResetController(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { email }: { email?: string } = req.query;

    if (!email) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const isUser = await prismaDB.user.findUnique({ where: { email } });

    // send a successful response to not identify if account with email exists
    if (!isUser) {
      return res.status(200).json({ success: true });
    }

    const randomString = randomstring.generate();

    const user = await prismaDB.user.update({
      where: { email },
      data: {
        passwordResetString: randomString,
      },
    });

    res.status(200).json({ success: true });

    const resetPasswordEmail = await emailService.sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      id: user.id,
      randomString,
    });

    return;
  } catch (err) {
    console.error(err);

    next(err);
  }
}

// PUT /password/reset/:userId/:token
export async function resetPasswordController(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { userId, token }: { userId?: string; token?: string } = req.params;

    if (!userId || !token) {
      return res
        .status(400)
        .json({ success: false, error: 'No ID or token provided' });
    }

    if (!isValidUuid(userId)) {
      return res.status(400).json({ success: false, error: 'Invalid ID' });
    }

    const { user }: { user: UserPasswordUpdateType } = req.body;

    const currentUser = await prismaDB.user.findUnique({
      where: { id: userId },
    });

    if (currentUser) {
      if (currentUser.passwordResetString === token) {
        // compare passwords
        const passwordCheck = await comparePassword(
          user.password,
          currentUser.password
        );

        if (passwordCheck) {
          return res.status(400).json({
            success: false,
            error: 'New password cannot be the same as current password',
          });
        }

        const hash = await hashPassword(user.password);

        await prismaDB.user.update({
          where: { id: userId },
          data: { passwordResetString: null, password: hash },
        });

        res.status(200).json({ success: true });

        // send email notification
        const passwordNotificationMessage =
          await emailService.sendPasswordUpdateNotification({
            email: currentUser.email,
            name: currentUser.name,
          });

        return;
      } else {
        return res.status(401).json({ success: false, error: 'Invalid token' });
      }
    }

    return res.status(404).json({ success: false, error: 'User not found' });
  } catch (err) {
    console.error(err);

    next(err);
  }
}
