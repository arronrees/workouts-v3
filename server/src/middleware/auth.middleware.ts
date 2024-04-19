import { NextFunction, Request, Response } from 'express';
import { signinUserModel, signupUserModel } from '../models/user.model';
import { z } from 'zod';
import { JsonApiResponse } from '../constant.types';
import { isValidUuid } from '../utils/index.utils';
import jwt from 'jsonwebtoken';
import { prismaDB } from '..';

export async function checkUserSignupObjectValid(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { user } = req.body;

    signupUserModel.parse(user);

    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err.format());

      return res
        .status(400)
        .json({ success: false, error: err.errors[0].message });
    } else {
      console.error(err);

      next(err);
    }
  }
}

export async function checkUserSigninObjectValid(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { user } = req.body;

    signinUserModel.parse(user);

    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err.format());

      return res
        .status(400)
        .json({ success: false, error: err.errors[0].message });
    } else {
      console.error(err);

      next(err);
    }
  }
}

declare module 'jsonwebtoken' {
  export interface UserIdJwtPayload extends jwt.JwtPayload {
    id: string;
  }
}

export async function checkJwtExists(
  req: Request,
  res: Response<JsonApiResponse>,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res
        .status(401)
        .json({ success: false, error: 'Authorisation token required' });
    }

    const token = authorization.split(' ')[1];

    const { id } = <jwt.UserIdJwtPayload>(
      jwt.verify(token, process.env.JWT_SECRET as string)
    );

    if (!isValidUuid(id)) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const user = await prismaDB.user.findUnique({
      where: { id },
      include: { profile: true, preferences: true },
    });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid user' });
    }

    // if user found add to locals object
    res.locals.user = user;
    res.locals.userToken = token;

    next();
  } catch (err) {
    console.error(err);

    next(err);
  }
}
