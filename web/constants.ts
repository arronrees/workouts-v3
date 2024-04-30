export const API_URL: string = process.env.NEXT_PUBLIC_API_URL ?? '';

export const SITE_URL: string = process.env.NEXT_PUBLIC_SITE_URL ?? '';

export const api = (url: string) => `${API_URL}${url}`;

export const muscleGroups: string[] = [
  'Chest',
  'Back',
  'Shoulders',
  'Triceps',
  'Biceps',
  'Abs',
  'Quads',
  'Glutes/Hamstrings',
  'Calves',
  'Other',
];
