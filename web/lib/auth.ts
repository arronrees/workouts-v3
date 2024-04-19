'use server';

import { JWT_SECRET, sn } from '@/constants';
import { JsonApiResponse } from '@/constants.types';
import { SignJWT, jwtVerify } from 'jose';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const key = new TextEncoder().encode(JWT_SECRET);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function logout() {
  // Destroy the session
  cookies().set('session', '', { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const res = NextResponse.next();

  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}

export async function signUp(
  prevState: {
    errorMessage: string | null;
    success: boolean;
  },
  formData: FormData
): Promise<{
  errorMessage: string | null;
  success: boolean;
}> {
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  if (!data.name || !data.email || !data.password) {
    return {
      errorMessage: 'Please fill in all fields.',
      success: false,
    };
  }

  try {
    const res = await fetch(sn('/api/auth/signup'), {
      method: 'POST',
      body: JSON.stringify({ user: data }),
      headers: { 'Content-Type': 'application/json' },
    });

    const json: JsonApiResponse = await res.json();

    if (!res.ok || !json.success) {
      if (json.error) {
        return {
          errorMessage: json.error,
          success: false,
        };
      }

      throw new Error(json.error);
    }

    // Create the session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ user: json.data, expires });

    // Save the session in a cookie
    cookies().set('session', session, { expires, httpOnly: true });

    revalidatePath('/', 'layout');
    return {
      errorMessage: null,
      success: true,
    };
  } catch (error) {
    console.error(error);

    revalidatePath('/', 'layout');
    return {
      errorMessage: 'An error occurred. Please try again.',
      success: false,
    };
  }
}

export async function signIn(
  prevState: {
    errorMessage: string | null;
    success: boolean;
  },
  formData: FormData
): Promise<{
  errorMessage: string | null;
  success: boolean;
}> {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  if (!data.email || !data.password) {
    return {
      errorMessage: 'Please fill in all fields.',
      success: false,
    };
  }

  try {
    const res = await fetch(sn('/api/auth/signin'), {
      method: 'POST',
      body: JSON.stringify({ user: data }),
      headers: { 'Content-Type': 'application/json' },
    });

    const json: JsonApiResponse = await res.json();

    if (!res.ok || !json.success) {
      if (json.error) {
        return {
          errorMessage: json.error,
          success: false,
        };
      }

      throw new Error(json.error);
    }

    // Create the session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ user: json.data, expires });

    // Save the session in a cookie
    cookies().set('session', session, { expires, httpOnly: true });

    revalidatePath('/', 'layout');
    return {
      errorMessage: null,
      success: true,
    };
  } catch (error) {
    console.error(error);

    revalidatePath('/', 'layout');
    return {
      errorMessage: 'An error occurred. Please try again.',
      success: false,
    };
  }
}
