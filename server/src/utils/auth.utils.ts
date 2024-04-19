import { genSalt, hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt();

  const hashedPassword = await hash(password, salt);

  return hashedPassword;
}

export async function comparePassword(
  inputPassword: string,
  passwordToCompare: string
): Promise<boolean> {
  const passwordsMatch = await compare(inputPassword, passwordToCompare);

  return passwordsMatch;
}

export function createJwtToken(id: string) {
  return sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
}
