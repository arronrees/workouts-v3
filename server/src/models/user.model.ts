import { z } from 'zod';

export const signupUserModel = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(5, 'Password must be at least 5 characters'),
});

export type SignupUserType = z.infer<typeof signupUserModel>;

export const signinUserModel = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
});

export type SigninUserType = z.infer<typeof signinUserModel>;

export const userPasswordUpdateModel = z
  .object({
    password: z
      .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
      })
      .min(6, 'Password must be at least 5 characters'),
    passwordConfirmation: z.string({
      required_error: 'Password confirmation is required',
      invalid_type_error: 'Password confirmation must be a string',
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

export type UserPasswordUpdateType = z.infer<typeof userPasswordUpdateModel>;

export const userDetailsUpdateModel = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
});

export type UserDetailsUpdateType = z.infer<typeof userDetailsUpdateModel>;
