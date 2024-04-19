export const API_URL: string = process.env.NEXT_PUBLIC_API_URL ?? '';

export const api = (url: string) => `${API_URL}${url}`;

export const JWT_SECRET = process.env.JWT_SECRET ?? '';
